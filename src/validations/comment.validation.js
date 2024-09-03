const joi = require('joi');
const { ObjectId } = require('./custom.validation');
const createdComment = {
  body: joi.object({
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'userId is required!'
      }),
    postId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'postId is required!'
      }),
    content: joi.string().optional(),
    newUrls: joi.array().items(joi.string()),
  }),
};

const deletedComment = {
  body: joi.object({
    commentId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'commentId is required!'
      }),
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'userId is required!'
      }),
  }),
};

const getComments = {
  params: joi.object({
    postId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'postId is required!'
      }),
  }),
};

const getCountComments = {
  params: joi.object({
    postId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'postId is required!'
      }),
  }),
};

const repliesComment = {
  body: joi.object({
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'userId is required!'
      }),
    commentId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'commentId is required!'
      }),
    postId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'postId is required!'
      }),
    content: joi.string().optional(),
    newUrls: joi.array().items(joi.string()),
  }),
};

const likeComment = {
  body: joi.object({
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'userId is required!'
      }),
    commentId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'commentId is required!'
      }),
  }),
};

const getCountLikes = {
  params: joi.object({
    commentId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'commentId is required!'
      }),
  }),
};

module.exports = {
  createdComment,
  deletedComment,
  getComments,
  getCountComments,
  repliesComment,
  likeComment,
  getCountLikes,
};