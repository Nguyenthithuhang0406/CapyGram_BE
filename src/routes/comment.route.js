const express = require('express');

const commentRoute = express.Router();

const commentController = require('../controllers/comment.controller');
const { auth } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const commentValidation = require('../validations/comment.validation');
const upload = require('../middlewares/upload.middleware');
const uploadFiles = require('../controllers/upload.controller');

commentRoute.post('/create', auth,upload.array('mediaComments', 20), uploadFiles, validate(commentValidation.createdComment), commentController.createdComment);

module.exports = commentRoute;