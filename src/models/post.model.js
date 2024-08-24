const { Schema, default: mongoose } = require('mongoose');

const PostSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  media: {
    type: [String],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "User",
  },
  shares: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "User",
  },
  // comments: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   default: [],
  //   ref: "Comment",
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;