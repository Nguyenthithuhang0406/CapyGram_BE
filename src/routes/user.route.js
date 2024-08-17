const express = require('express');
const validate = require('../middlewares/validate.middleware');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');

const userRoute = express.Router();

userRoute.post('/register', validate(userValidation.registerValidation), userController.register);
userRoute.post('/verify', userController.verifyOtp);

module.exports = userRoute;