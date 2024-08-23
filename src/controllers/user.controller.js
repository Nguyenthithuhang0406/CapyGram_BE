const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const { validateEmail, validateNumber } = require("../validations/utils.validation");
const { registerValidation } = require("../validations/user.validation");

const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/nodemailer");
const sendSMS = require("../utils/sendSMS");
const { admin } = require("../../config/firebase.config");

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

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || user.isVerified === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username or password is incorrect!");
  }

  const isPasswordMatch = bcrypt.compareSync(password, user?.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username or password is incorrect!");
  }

  const payload = {
    username: user.username,
    userID: user._id,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY_REFRESH, { expiresIn: '7d' });

  return res.status(httpStatus.OK).json({
    message: "User logged in successfully!",
    code: httpStatus.OK,
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
});


const getRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Refresh token is required!");
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY_REFRESH);

    const user = await User.findById(payload.userID);

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token!");
    }

    const newAccessToken = jwt.sign({ username: user.username, userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    const newRefreshToken = jwt.sign({ username: user.username, userID: user._id }, process.env.JWT_SECRET_KEY_REFRESH, { expiresIn: '7d' });

    return res.status(httpStatus.OK).json({
      message: "Token refreshed successfully!",
      code: httpStatus.OK,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token!");
  }
});

const getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  console.log("userId", userId);
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required!");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  return res.status(httpStatus.OK).json({
    message: "Get user by ID successfully!",
    code: httpStatus.OK,
    data: {
      user,
    },
  });

});

const searchUserByUsernameOrFullname = catchAsync(async (req, res) => {
  const { input } = req.body;
  // console.log("input", input);

  if (!input) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Input is required!");
  }


  //đk tìm kiếm gần đúng
  const searchCriteria = {
    $or: [
      { username: { $regex: input, $options: 'i' } },
      { fullname: { $regex: input, $options: 'i' } },
    ],
  };

  const users = await User.find(searchCriteria);

  if (users.length === 0) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "No user found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  return res.status(httpStatus.OK).json({
    message: "Search user by username or fullname successfully!",
    code: httpStatus.OK,
    data: {
      users,
    },
  });
});


const uploadAvatar = catchAsync(async (req, res) => {
  const {userId} = req.body;
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Avatar image is required!");
  }
  
  const bucket = admin.storage().bucket();
  const blob = bucket.file(`Avatars/${Date.now()}_${req.file.originalname}`);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });
  
  const uploadPromises = new Promise((resolve, reject) => {
    blobStream.on("error", (error) => {
      // console.error(error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload avatar!");
    });
    
    blobStream.on("finish", () => {
      // Không hard code url nhé
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket.name)}/o/${encodeURIComponent(blob.name)}?alt=media`;
      resolve(publicUrl);
    });
    
    blobStream.end(req.file.buffer);
  });
  
  try {
    const avatarUrl = await uploadPromises;
    
    const user = await User.findByIdAndUpdate(userId, { avatarUrl }, { new: true });
    res.status(httpStatus.OK).json({
      message: "Avatar uploaded successfully!",
      code: httpStatus.OK,
      data: {
        user: user,
      },
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload avatar!");
  }
});

const updateProfile = catchAsync(async (req, res) => {
  const { gender, website, bio } = req.body;
  const { userId } = req.params;
  const user = await User.findByIdAndUpdate(userId, { gender, website, bio }, { new: true });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  return res.status(httpStatus.OK).json({
    message: "Update profile successfully!",
    code: httpStatus.OK,
    data: {
      user,
    },
  });

});
module.exports = { register, verifyOtp, login, getRefreshToken, getUserById, searchUserByUsernameOrFullname, uploadAvatar, updateProfile };

