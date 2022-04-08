const userService = require('../services/user.service')

module.exports = {
    login: async (req, res) => {
        const user = await userService.login(req.body)
        return res.json(user)
    },
    signup: async (req, res) => {
        const user = await userService.signup(req.body)
        return res.json(user)
    },
    updatePassword: async (req, res) => {
        await userService.updatePassword(req.user, req.body)
        return res.sendStatus(204)
    },
    updateEmail: async (req, res) => {
        await userService.updateEmail(req.user, req.body)
        return res.sendStatus(204)
    },
    deleteUser: async (req, res) => {
        await userService.deleteUser(req.user)
        return res.sendStatus(204)
    },
    getInfo: async (req, res) => {
        const info = await userService.getInfo(req.user)
        return res.json(info)
    }
}