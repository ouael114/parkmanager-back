const catchErrors = require('../middlewares/catchErrors')
const Enums = require('../models/enums')
const authorize = require('../middlewares/auth')
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

const { USER, ADMIN } = Enums.ROLES

router.post('/login', catchErrors(userController.login));
router.post('/signup', catchErrors(userController.signup));

router.put('/password', authorize(USER) ,catchErrors(userController.updatePassword))
router.put('/email', authorize(USER) ,catchErrors(userController.updateEmail))

router.delete('/', authorize(USER), catchErrors(userController.deleteUser))

router.get('/', authorize(USER), catchErrors(userController.getInfo))


module.exports = router;