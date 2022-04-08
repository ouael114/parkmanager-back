const db = require('../config/db');
const util = require('util');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Enums = require('../models/enums')
const NotFoundError = require('../errors/notFoundError')
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');

const query = util.promisify(db.query).bind(db);

module.exports = {
    login: async (body) => {
        const { email, password } = body
        const findUserQuery = 'SELECT * FROM users WHERE email=?';
        const resultFindUser = await query(findUserQuery,[email]);

        if(!resultFindUser.length) throw new NotFoundError("there's no account with this email")
        else if(!await bcrypt.compare(password, resultFindUser[0].password)) throw new UnauthorizedError("incorrect password")
        else {
            const token = jwt.sign({
                role: resultFindUser[0].role,
                user: resultFindUser[0].id
            }, process.env.SECRET, { expiresIn: '1h' })
            resultFindUser[0].token = token

            return resultFindUser[0]
        }
    },
    signup: async (body) => {

        const { nom, prenom, email, password, role } = body

        if(!Object.values(Enums.ROLES).includes(role)) throw new BadRequestError('role must be in enum')

        const findUserQuery = 'SELECT * FROM users WHERE email=?';
        const resultFindUser = await query(findUserQuery,[email]);

        if(resultFindUser.length) throw new BadRequestError('this email is already in use')
        else{
            const insertUserQuery = "INSERT INTO users ( nom , prenom , email, password, role) VALUES (?,?,?,?,?)";

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const resultInsert = await query(insertUserQuery,[nom,prenom,email,hashedPassword,role]);
            return {insertedId: resultInsert.insertId}
        }

    },
    updatePassword: async (userId, body) => {
        const { oldPassword, newPassword } = body
        const findUserQuery = 'SELECT * FROM users WHERE id=?';
        const resultFindUser = await query(findUserQuery,[userId]);

        if(!resultFindUser.length) throw new NotFoundError("user not found")
        else if(!await bcrypt.compare(oldPassword, resultFindUser[0].password)) throw new UnauthorizedError("incorrect old password")
        else {
            const updateUserQuery = "UPDATE users SET password=? WHERE id=?";

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await query(updateUserQuery,[hashedPassword, userId]);
        }
    },
    updateEmail: async (userId, body) => {
        const { email } = body

        const checkEmailQuery = 'SELECT * FROM users WHERE email=?';
        const resultCheckEmail = await query(checkEmailQuery,[email]);
        if(resultCheckEmail.length) throw new BadRequestError('this email is already in use')

        const findUserQuery = 'SELECT * FROM users WHERE id=?';
        const resultFindUser = await query(findUserQuery,[userId]);

        if(!resultFindUser.length) throw new NotFoundError("user not found")
        else {
            const updateUserQuery = "UPDATE users SET email=? WHERE id=?";
            await query(updateUserQuery,[email, userId]);
        }
    },
    deleteUser: async (userId) => {
        const deleteUserQuery = 'DELETE FROM users WHERE id=?';
        await query(deleteUserQuery,[userId]);
    },
    getInfo: async (userId) => {
        const getUserQuery = 'SELECT * FROM users WHERE id=?';
        const resultGetUser = await query(getUserQuery,[userId]);
        if(!resultGetUser.length) throw new NotFoundError('user not found')
        else return resultGetUser[0]
    }
}