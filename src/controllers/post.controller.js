const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const Post = require("../models/post.model");
const User = require("../models/user.model");

const createPost = catchAsync(async (req, res) => {
  const { content, media, userId, newUrls } = req.body;

  if (!userId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "userId is required!",
      code: httpStatus.BAD_REQUEST,
    });
  }

  const post = new Post({
    userId,
    content,
    media: newUrls,
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

const updatePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { content, media, userId, newUrls } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Post not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  if (post.userId.toString() !== userId) {
    return res.status(httpStatus.FORBIDDEN).json({
      message: "You are not authorized to update this post!",
      code: httpStatus.FORBIDDEN,
    });
  }

  post.content = content || post.content;
  post.media = [...media, ...newUrls] ;

  await post.save();

  return res.status(httpStatus.OK).json({
    message: "Update post successfully!",
    code: httpStatus.OK,
    data: {
      post,
    },
  });
});
  
const deletePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Post not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  if (post.userId.toString() !== userId) {
    return res.status(httpStatus.FORBIDDEN).json({
      message: "You are not authorized to delete this post!",
      code: httpStatus.FORBIDDEN,
    });
  }

  await post.deleteOne();

  return res.status(httpStatus.OK).json({
    message: "Delete post successfully!",
    code: httpStatus.OK,
  });
});
  
const getAllPosts = catchAsync(async (req, res) => {
  const posts = await Post.find();

  return res.status(httpStatus.OK).json({
    message: "Get all posts successfully!",
    code: httpStatus.OK,
    data: {
      posts,
    },
  });
});

const getPostByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const posts = await Post.find({ userId });

  return res.status(httpStatus.OK).json({
    message: "Get posts by userId successfully!",
    code: httpStatus.OK,
    data: {
      posts,
    },
  });
});


const likePost = catchAsync(async (req, res) => {
  const { postId, userId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Post not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((like) => like !== userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();

  return res.status(httpStatus.OK).json({
    message: "Like post successfully!",
    code: httpStatus.OK,
    data: {
      post,
    },
  });
});


const sharePost = catchAsync(async (req, res) => {
  const { postId, userId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Post not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  post.shares.push(userId);

  await post.save();

  return res.status(httpStatus.OK).json({
    message: "Share post successfully!",
    code: httpStatus.OK,
    data: {
      post,
    },
  });
});


const getCountLikes = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Post not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  return res.status(httpStatus.OK).json({
    message: "Get count likes successfully!",
    code: httpStatus.OK,
    data: {
      count: post.likes.length,
    },
  });

});

const getCountShares = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Post not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  return res.status(httpStatus.OK).json({
    message: "Get count shares successfully!",
    code: httpStatus.OK,
    data: {
      count: post.shares.length,
    },
  });

});


const getNewFeeds = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User not found!",
      code: httpStatus.NOT_FOUND,
    });
  }

  const following = user.following;

  const posts = await Post.find({ userId: { $in: following } }).sort({ createdAt: -1 });

  return res.status(httpStatus.OK).json({
    message: "Get new feeds successfully!",
    code: httpStatus.OK,
    data: {
      posts,
    },
  });
});

const getReels = catchAsync(async (req, res) => {
  const posts = await Post.aggregate([
    { $addFields: { likesCount: { $size: "$likes" } } },
    { $sort: { createdAt: -1, likesCount: -1 } },
  ]);

  const medias = posts.map((post) => post.media).flat();

  const videos = medias.filter((media) => media.includes("Fvideo"));

  return res.status(httpStatus.OK).json({
    message: "Get reels successfully!",
    code: httpStatus.OK,
    data: {
      videos,
    },
  });
});

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getPostByUserId,
  likePost,
  sharePost,
  getCountLikes,
  getCountShares,
  getNewFeeds,
  getReels
}