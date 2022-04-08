const db = require('../config/db');
const util = require('util');
const placesLogService = require('../services/placesLog.service')
const NotFoundError = require('../errors/notFoundError')
const BadRequestError = require('../errors/badRequestError')


const query = util.promisify(db.query).bind(db);

module.exports = {
    getAllPlaces: async () => {
        const findPlacesQuery = 'SELECT * FROM placeparking';
        const resultFindPlaces = await query(findPlacesQuery);

        for (let i = 0; i < resultFindPlaces.length; i++) {
            const place = resultFindPlaces[i];
            if(place.occupant){
                const findUserQuery = 'SELECT * FROM users WHERE id=?';
                const resultFindUser = await query(findUserQuery,[place.occupant]);
                resultFindPlaces[i].user = `${resultFindUser[0].prenom} ${resultFindUser[0].nom}`
            }
        }

        return resultFindPlaces
    },
    getFreePlacesByEtage: async (etage) =>{
        if(!etage) throw new BadRequestError('you must specify a floor')
        const findPlacesQuery = 'SELECT * FROM placeparking WHERE etage=? AND disponibilite=?';
        const resultFindPlaces = await query(findPlacesQuery,[etage,true]);

        return resultFindPlaces
    },
    getPlaceByUser: async (userId) => {
        const findPlaceQuery = 'SELECT * FROM placeparking WHERE occupant=?';
        const resultFindPlace = await query(findPlaceQuery,[userId]);

        if(!resultFindPlace.length) throw new BadRequestError("you don't have any parking place assigned")
        else{
            return resultFindPlace[0]
        }
    },
    addPlace: async (body) => {
        const { numero , etage } = body
        if(!numero) throw new BadRequestError('you must speficy parking place number')
        if(!etage) throw new BadRequestError('you must speficy parking floor')

        const findPlaceQuery = 'SELECT * FROM placeparking WHERE numero=? AND etage=?';
        const resultFindPlace = await query(findPlaceQuery,[numero,etage]);

        if(resultFindPlace.length) throw new BadRequestError('a place with this number already exists in this floor')

        const insertPlaceQuery = "INSERT INTO placeparking ( numero , etage , disponibilite ) VALUES (?,?,?)";
        const resultInsert = await query(insertPlaceQuery,[numero,etage,true]);
        return { insertedId: resultInsert.insertId }
    },
    assignPlace: async (placeId, userId) => {
        if(!placeId) throw new BadRequestError('you must specify a parking place')
        const findPlaceQuery = 'SELECT * FROM placeparking WHERE id=?';
        const resultFindPlace = await query(findPlaceQuery,[placeId]);

        if(!resultFindPlace.length) throw new NotFoundError('parking place not found')
        else if(!resultFindPlace[0].disponibilite) throw new BadRequestError(' this parking place is not available, please choose another one')
        else{
            const updatePlaceQuery = 'UPDATE placeparking SET disponibilite=?, occupant=?, temps_occupation=? WHERE id=?';
            const nowDate = Date.now()
            await query(updatePlaceQuery,[false,userId,nowDate,placeId]);
        }
    },
    unassignPlace: async (placeId, userId) => {
        if(!placeId) throw new BadRequestError('you must specify a parking place')
        const findPlaceQuery = 'SELECT * FROM placeparking WHERE id=?';
        const resultFindPlace = await query(findPlaceQuery,[placeId]);

        if(!resultFindPlace.length) throw new BadRequestError('parking place not found')
        else if(resultFindPlace[0].occupant != userId) throw new BadRequestError("this parking place isn't assigned to you")
        else{
            const updatePlaceQuery = 'UPDATE placeparking SET disponibilite=?, temps_occupation=?, occupant=? WHERE id=?';
            await query(updatePlaceQuery,[true,null,null,placeId]);
            const nowDate = Date.now()
            placesLogService.addLog(placeId, userId, resultFindPlace[0].temps_occupation, nowDate)
        }
    }
}