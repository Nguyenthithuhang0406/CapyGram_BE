const joi = require("joi");
const { ObjectId } = require("./custom.validation");

const followOrUnfollow = {
  params: joi.object({ 
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .description("User ID")
      .messages({
        'any.required': 'userId is required!'
      }),
    followedId: joi.string()
      .required()
      .custom(ObjectId)
      .description("Follow ID")
      .messages({
        'any.required': 'followId is required!'
      }),
  }),
};

module.exports = {
  followOrUnfollow,
};