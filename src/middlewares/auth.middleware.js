const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");

const auth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  };

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized! Please login to get access",
      code: 401,
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await User.findById(payload.userID);

    if (!user || user.isVerified === false) {
      return res.status(404).json({
        message: "User not found",
        code: 404,
      });
    };

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Invalid token",
      code: 400,
    });
  }
});

module.exports = {auth};