const joi = require("joi");
const { ObjectId } = require("./custom.validation");

const createPost = {
  body: joi.object({
    userId: joi.string()
      .custom(ObjectId)
      .required()
      .messages({
        'any.required': 'userId is required!',
      }),
    content: joi.string().optional(),
    media: joi.array().items(joi.string()).optional(),
    newUrls: joi.array().items(joi.string()).optional(),
  }),
  
};

const updatePost = {
  params: joi.object({
    postId: joi.string()
      .custom(ObjectId)
      .required()
      .messages({
        'any.required': 'postId is required!',
      }),
  }),
  body: joi.object({
    userId: joi.string()
      .custom(ObjectId)
      .required()
      .messages({
        'any.required': 'userId is required!',
      }),
    content: joi.string().optional(),
    media: joi.array().items(joi.string()).optional(),
    newUrls: joi.array().items(joi.string()).optional(),
  }),
};

const deletePost = {
  params: joi.object({
    postId: joi.string()
      .custom(ObjectId)
      .required()
      .messages({
        'any.required': 'postId is required!',
      }),
  }),
  body: joi.object({
    userId: joi.string()
      .custom(ObjectId)
      .required()
      .messages({
        'any.required': 'userId is required!',
      }),
  }),
};

const getPostByUserId = {
  params: joi.object({
    userId: joi.string()
      .custom(ObjectId)
      .required()
      .messages({
        'any.required': 'userId is required!',
      }),
  }),
};

const likePost = {
  params: joi.object({
    postId: joi.string()
      .custom(ObjectId)
      .required()
      .messages({
        'any.required': 'postId is required!',
      }),
    userId: joi.string()
      .custom(ObjectId)
      .required()
      .messages({
        'any.required': 'userId is required!',
      }),
  }),
};

const sharePost = {
  params: joi.object({
    postId: joi.string()
      .custom(ObjectId)
      .required()
      .messages({
        'any.required': 'postId is required!',
      }),
    userId: joi.string()
      .custom(ObjectId)
      .required()
      .messages({
        'any.required': 'userId is required!',
      }),
  }),
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostByUserId,
  likePost,
  sharePost,
};

