const httpStatus = require("http-status");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");

const followOrUnfollow = catchAsync(async (req, res) => {
  //userId di fl followId
  const { userId, followedId } = req.params;

  const user = await User.findById(userId);
  const followed = await User.findById(followedId);

  if (!user || !followed) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User or follow not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  if (user.following.includes(followedId)) {
    //neu follow r thi huy fl
    user.following.filter((id) => id !== followedId);
    followed.followers.filter((id) => id !== userId);
  }

  //chua thi fl
  user.following.push(followedId);
  followed.followers.push(userId);

  await user.save();
  await followed.save();

  return res.status(httpStatus.OK).json({
    message: "Follow successfully!",
    code: httpStatus.OK,
    data: {
      user,
      followed,
    },
  });

});

module.exports = {
  followOrUnfollow,
};