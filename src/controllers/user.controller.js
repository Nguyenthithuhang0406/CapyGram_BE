const httpStatus = require("http-status");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const { validateEmail, validateNumber } = require("../validations/utils.validation");
const { registerValidation } = require("../validations/user.validation");

const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/nodemailer");
const sendSMS = require("../utils/sendSMS");

const register = catchAsync(async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Username already exists!");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const user = new User({
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    fullname: req.body.fullname,
    birthday: req.body.birthday,
  });

  await user.save();

  const otp = generateOtp();

  const { error } = registerValidation.body.validate(req.body);

  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }


  if (validateEmail(user.email)) {
    await sendEmail(user.email, user.fullname, otp);
  } else {
    if (validateNumber(user.email)) {
      await sendSMS(user.email, user.fullname, otp);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email or phone number is invalid!");
    }
  }

  await Otp.create({ otp, userId: user._id });


  return res.status(httpStatus.CREATED).json({
    message: "User registered successfully! OTP sent!",
    code: httpStatus.CREATED,
    data: {
      user,
    },

  });
});

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const verifyOtp = catchAsync(async (req, res) => {
  const { username, otp } = req.body;

  const otpDoc = await Otp.findOne({ otp });

  if (!otpDoc) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Invalid OTP!",
      code: httpStatus.NOT_FOUND,
    });
  }

  const isExit = await User.exists({ _id: otpDoc.userId });
  if (!isExit) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Incorrect OTP!",
      code: httpStatus.BAD_REQUEST,
    });
  }

  const user = await User.findById(otpDoc.userId);

  if (username == user.username) {
    user.isVerified = true;
    await user.save();
    await Otp.deleteOne({ otp });
    return res.status(httpStatus.OK).json({
      message: "OTP verified successfully!",
      code: httpStatus.OK,
    });
  } else {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Incorrect OTP!",
      code: httpStatus.BAD_REQUEST,
    });
  }

});

module.exports = { register, verifyOtp };

