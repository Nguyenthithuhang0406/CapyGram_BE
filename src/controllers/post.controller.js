const httpStatus = require("http-status");
const Post = require("../models/post.model");
const catchAsync = require("../utils/catchAsync")

const createPost = catchAsync(async (req, res) => {
  const { content, media, userId } = req.body;

  if (!userId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "userId is required!",
      code: httpStatus.BAD_REQUEST,
    });
  }

  const post = new Post({
    userId,
    content,
    media,
  });

  await post.save();

  return res.status(httpStatus.CREATED).json({
    message: "Create post successfully!",
    code: httpStatus.CREATED,
    data: {
      post,
    },
  });
});

module.exports = {createPost}