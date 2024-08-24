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
  }),
  
};

module.exports = {createPost}

