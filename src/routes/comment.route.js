const express = require('express');

const commentRoute = express.Router();

const commentController = require('../controllers/comment.controller');
const { auth } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const commentValidation = require('../validations/comment.validation');
const upload = require('../middlewares/upload.middleware');
const uploadFiles = require('../controllers/upload.controller');

commentRoute.post('/create', auth, upload.array('mediaComments', 20), uploadFiles, validate(commentValidation.createdComment), commentController.createdComment);
commentRoute.delete('/delete', auth, validate(commentValidation.deletedComment), commentController.deletedComment);
commentRoute.get('/getComments/:postId', validate(commentValidation.getComments), commentController.getComments);
commentRoute.get('/getCountComments/:postId', validate(commentValidation.getCountComments), commentController.getCountComments);
commentRoute.post('/replies', auth, upload.array('mediaReplies', 20), uploadFiles, validate(commentValidation.repliesComment), commentController.repliesComment);
commentRoute.put('/like/', auth, validate(commentValidation.likeComment), commentController.likeComment);
commentRoute.get('/getCountLikes/:commentId', validate(commentValidation.getCountLikes), commentController.getCountLikes);

module.exports = commentRoute;