const { Schema, default: mongoose } = require('mongoose');

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  content: {
    type: String,
  },
  imageOrVideo: {
    type: [String],
    default: [],
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User',
  },
  replies: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Comment',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
