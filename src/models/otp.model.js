const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '2m',
  },
});

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;