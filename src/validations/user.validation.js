const joi = require('joi');
const { validateEmail, validateNumber } = require('./utils.validation');
const { ObjectId } = require('./custom.validation');

const registerValidation = {
  body: joi.object({
    username: joi.string()
      .min(5)
      .max(30)
      .required()
      .messages({
        'string.min': 'Tên đăng nhập phải có ít nhất 5 ký tự',
        'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
        'any.required': 'Tên đăng nhập không được để trống',
      }),
    email: joi.string()
      .custom((value, helpers) => {

        if (!validateEmail(value) && !validateNumber(value)) {
          return helpers.error('any.invalid', { message: 'Email hoặc số điện thoại không hợp lệ' });
        }

        return value;
      }, "Email hoặc số điện thoại không hợp lệ")
      .required(),
    password: joi.string()
      .min(8)
      .max(16)
      .pattern(/[!@#$%^&*(),.?":{}|<>]/)
      .pattern(/\d/)
      .pattern(/[A-Za-z].*[A-Za-z]/)
      .required()
      .messages({
        'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
        'string.max': 'Mật khẩu không được vượt quá 16 ký tự',
        'string.pattern.base': 'Mật khẩu phải chứa ít nhất 1 ký tự số, 1 ký tự đặc biệt và 2 ký tự chữ cái',
        'any.required': 'Mật khẩu không được để trống',
      }),
    fullname: joi.string()
      .min(5)
      .max(30)
      .required()
      .messages({
        'string.min': 'Họ tên phải có ít nhất 5 ký tự',
        'string.max': 'Họ tên không được vượt quá 30 ký tự',
        'any.required': 'Họ tên không được để trống',
      }),
    birthday: joi.date()
      .required()
      .messages({
        'date.base': 'Ngày sinh không hợp lệ',
        'any.required': 'Ngày sinh không được để trống',
      }),
  }),
};

const login = {
  body: joi.object({
    username: joi.string()
      .min(5)
      .max(30)
      .required()
      .messages({
        'string.min': 'Tên đăng nhập phải có ít nhất 5 ký tự',
        'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
        'any.required': 'Tên đăng nhập không được để trống',
      }),
    password: joi.string()
      .min(8)
      .max(16)
      .pattern(/[!@#$%^&*(),.?":{}|<>]/)
      .pattern(/\d/)
      .pattern(/[A-Za-z].*[A-Za-z]/)
      .required()
      .messages({
        'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
        'string.max': 'Mật khẩu không được vượt quá 16 ký tự',
        'string.pattern.base': 'Mật khẩu phải chứa ít nhất 1 ký tự số, 1 ký tự đặc biệt và 2 ký tự chữ cái',
        'any.required': 'Mật khẩu không được để trống',
      }),
  }),
};

const refreshToken = {
  body: joi.object({
    refreshToken: joi.string()
      .required()
      .messages({
        'any.required': 'Refresh token không được để trống',
      }),
  }),
};

const getUserById = {
  params: joi.object({
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'User ID không được để trống',
      }),
  }),
};

const searchUserByUsernameOrFullname = {
  body: joi.object({
    input: joi.string()
      .required()
      .messages({
        'any.required': 'Input không được để trống',
      }),
  }),
};

const updateProfile = {
  body: joi.object({
    gender: joi.string().optional(),
    website: joi.string().optional(),
    bio: joi.string().optional()
  }),
  params: joi.object({
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'any.required': 'User ID không được để trống',
      }),
  }),
}
module.exports = { registerValidation, login, refreshToken, getUserById, searchUserByUsernameOrFullname, updateProfile };
