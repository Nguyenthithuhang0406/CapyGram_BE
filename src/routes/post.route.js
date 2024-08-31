const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const postController = require('../controllers/post.controller');
const validate = require('../middlewares/validate.middleware');
const postValidation = require('../validations/post.validation');
const uploadFiles = require('../controllers/upload.controller');

const postRoute = express.Router();

postRoute.post('/createPost', auth, upload.array('media', 20), uploadFiles, validate(postValidation.createPost), postController.createPost);
postRoute.put('/updatePost/:postId', auth, upload.array('newFiles', 20), uploadFiles, validate(postValidation.updatePost), postController.updatePost);
postRoute.delete('/deletePost/:postId', auth, validate(postValidation.deletePost), postController.deletePost);
postRoute.get('/getAllPosts', postController.getAllPosts);
postRoute.get('/getPostByUserId/:userId',auth, validate(postValidation.getPostByUserId), postController.getPostByUserId);
postRoute.put('/:userId/likePost/:postId', auth, validate(postValidation.likePost), postController.likePost);
module.exports = postRoute;