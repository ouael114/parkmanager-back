const placesService = require('../services/placeParking.service')
const placesLogService = require('../services/placesLog.service')

module.exports = {
    getAllPlaces: async (req, res) => {
        const places = await placesService.getAllPlaces()
        return res.json(places)
    },
    getFreePlacesByEtage: async (req, res) => {
        const places = await placesService.getFreePlacesByEtage(req.body.etage)
        return res.json(places)
    },
    getPlaceByUser: async (req, res) => {
        const place = await placesService.getPlaceByUser(req.user)
        return res.json(place)
    },
    addPlace: async (req, res) => {
        const placeId = await placesService.addPlace(req.body)
        return res.json(placeId)
    },
    assignPlace: async (req, res) => {
        await placesService.assignPlace(req.params.placeId, req.user)
        return res.sendStatus(204)
    },
    unassignPlace: async (req, res) => {
        await placesService.unassignPlace(req.params.placeId, req.user)
        return res.sendStatus(204)
    },
    getParkingLog: async (req, res) => {
        const logs = await placesLogService.getParkingLog()
        return res.json(logs)
    }
}