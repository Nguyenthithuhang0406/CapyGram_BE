const express = require('express');
const validate = require('../middlewares/validate.middleware');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');
const { auth } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
// const uploadImages = require('../controllers/upload.controller');

const userRoute = express.Router();

userRoute.post('/register', validate(userValidation.registerValidation), userController.register);
userRoute.post('/verify', userController.verifyOtp);
userRoute.post('/login', validate(userValidation.login), userController.login);
userRoute.post("/refresh-tokens", validate(userValidation.refreshToken), userController.getRefreshToken);
userRoute.get('/:userId', auth, validate(userValidation.getUserById), userController.getUserById);
userRoute.post('/search', auth, validate(userValidation.searchUserByUsernameOrFullname), userController.searchUserByUsernameOrFullname);
userRoute.post('/upload-avatar', auth, upload.single('avatar'), userController.uploadAvatar);
// userRoute.post('/upload-images', upload.array('images', 10), uploadImages);

module.exports = userRoute;