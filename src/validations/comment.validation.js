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

module.exports = {
  createdComment,
};