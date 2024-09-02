const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

const createdComment = catchAsync(async (req, res) => {
  const { userId, postId, content, newUrls } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Post not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  const comment = new Comment({
    userId,
    postId,
    content,
    imageOrVideo : newUrls || [],
  });

  await comment.save();

  post.comments.push(comment._id);

  await post.save();

  return res.status(httpStatus.OK).json({
    message: "Created comment successfully!",
    code: httpStatus.OK,
    data: {
      comment,
    },
  });
});

module.exports = {
  createdComment,
};