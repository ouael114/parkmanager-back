const catchErrors = require('../middlewares/catchErrors')
const express = require('express');
const router = express.Router();
const Enums = require('../models/enums')
const placeParkingController = require('../controllers/placeParking.controller');

const { USER, ADMIN } = Enums.ROLES

router.get('/all', authorize(ADMIN), catchErrors(placeParkingController.getAllPlaces));
router.get('/byEtage', authorize(USER,ADMIN), catchErrors(placeParkingController.getFreePlacesByEtage))
router.get('/byUser', authorize(USER), catchErrors(placeParkingController.getPlaceByUser))
router.get('/log', authorize(ADMIN), catchErrors(placeParkingController.getParkingLog))

router.put('/assign/:placeId', authorize(USER), catchErrors(placeParkingController.assignPlace));
router.put('/unassign/:placeId', authorize(USER), catchErrors(placeParkingController.unassignPlace));

router.post('/', authorize(ADMIN), catchErrors(placeParkingController.addPlace))

module.exports = router;