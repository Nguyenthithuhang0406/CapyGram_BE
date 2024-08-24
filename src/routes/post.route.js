const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const postController = require('../controllers/post.controller');
const validate = require('../middlewares/validate.middleware');
const postValidation = require('../validations/post.validation');
const uploadFiles = require('../controllers/upload.controller');

const postRoute = express.Router();

postRoute.post('/createPost', auth, upload.array('media', 20), uploadFiles, validate(postValidation.createPost), postController.createPost);

module.exports = postRoute;