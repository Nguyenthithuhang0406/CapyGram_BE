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
module.exports = {
  createdComment,
  deletedComment,
  getComments,
};