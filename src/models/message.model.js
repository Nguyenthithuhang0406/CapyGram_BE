const { Schema, default: mongoose } = require('mongoose');

const messageSchema = new Schema({
  message: {
    text: {
      type: String,
      // required: true,
    },
    media: {
      type: [String],
    },
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isReceiverDeleted: {
    type: Boolean,
    default: false,
  },
  isSenderDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;