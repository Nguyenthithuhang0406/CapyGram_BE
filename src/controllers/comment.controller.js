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

const getComments = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate("comments");

  if (!post) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Post not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  return res.status(httpStatus.OK).json({
    message: "Get comments successfully!",
    code: httpStatus.OK,
    data: {
      comments: post.comments,
    },
  });
});

const getCountComments = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate("comments");

  if (!post) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Post not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  return res.status(httpStatus.OK).json({
    message: "Get count comments successfully!",
    code: httpStatus.OK,
    data: {
      count: post.comments.length,
    },
  });

});

const repliesComment = catchAsync(async (req, res) => {
  const { userId, postId, content, newUrls, commentId } = req.body;

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
    replies: commentId,
  });

  await comment.save();

  post.comments.push(comment._id);

  await post.save();

  return res.status(httpStatus.OK).json({
    message: "Replies comment successfully!",
    code: httpStatus.OK,
    data: {
      comment,
    },
  });

});

const likeComment = catchAsync(async (req, res) => {
  const { commentId, userId } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Comment not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  if (comment.likes.includes(userId)) {
    comment.likes = comment.likes.filter((like) => like !== userId);
  } else {
    comment.likes.push(userId);
  }

  await comment.save();

  return res.status(httpStatus.OK).json({
    message: "Like comment successfully!",
    code: httpStatus.OK,
    data: {
      comment,
    },
  });

});

const getCountLikes = catchAsync(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Comment not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  return res.status(httpStatus.OK).json({
    message: "Get count likes successfully!",
    code: httpStatus.OK,
    data: {
      count: comment.likes.length,
    },
  });

});
module.exports = {
  createdComment,
  deletedComment,
  getComments,
  getCountComments,
  repliesComment,
  likeComment,
  getCountLikes
};