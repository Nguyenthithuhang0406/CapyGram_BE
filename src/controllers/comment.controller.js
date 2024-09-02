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
    imageOrVideo: newUrls || [],
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

const deletedComment = catchAsync(async (req, res) => {
  const { commentId, userId } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Comment not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  if (comment.userId.toString() !== userId) {
    return res.status(httpStatus.FORBIDDEN).json({
      message: "You do not have permission to delete this comment!",
      code: httpStatus.FORBIDDEN,
    });
  }

  await comment.deleteOne();

  return res.status(httpStatus.OK).json({
    message: "Delete comment successfully!",
    code: httpStatus.OK,
  });
});

module.exports = {
  createdComment,
  deletedComment,
};