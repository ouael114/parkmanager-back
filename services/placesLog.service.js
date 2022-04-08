const db = require('../config/db');
const util = require('util');

const query = util.promisify(db.query).bind(db);

module.exports = {
    getParkingLog: async () => {

        const getLogQuery = 'SELECT * FROM log_places';
        const resultgetLog = await query(getLogQuery);

        for (let i = 0; i < resultgetLog.length; i++) {
            const logElem = resultgetLog[i];

            const findUserQuery = 'SELECT * FROM users WHERE id=?';
            const resultFindUser = await query(findUserQuery,[logElem.id_user]);
            if(resultFindUser.length) resultgetLog[i].user = `${resultFindUser[0].prenom} ${resultFindUser[0].nom}`
        }

        return resultgetLog
    },
    addLog: async (idPlace, idUser, arrive, sortie) => {
        const insertLogQuery = "INSERT INTO log_places ( id_place , id_user , temps_arrive, temps_sortie ) VALUES (?,?,?,?)";
        const resultInsert = await query(insertLogQuery,[idPlace,idUser,arrive,sortie]);
        return {insertedId: resultInsert.insertId}
    }
}