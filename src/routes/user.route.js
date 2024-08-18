const express = require('express');
const validate = require('../middlewares/validate.middleware');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');
const { auth } = require('../middlewares/auth.middleware');

const userRoute = express.Router();

userRoute.post('/register', validate(userValidation.registerValidation), userController.register);
userRoute.post('/verify', userController.verifyOtp);
userRoute.post('/login', validate(userValidation.login), userController.login);
userRoute.post("/refresh-tokens", validate(userValidation.refreshToken), userController.getRefreshToken);

module.exports = userRoute;