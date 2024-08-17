const { Schema, default: mongoose } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
    enum:['male', 'female', 'other'],
    default: "other",
  },
  website: {
    type: String,
  },
  bio: {
    type: String,
  },
  // followers: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   default: [],
  //   ref: "User",
  // },
  // following: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   default: [],
  //   ref: "User",
  // },
  isVerified: {
    type: Boolean,
    default: false,
  },

});

const User = mongoose.model("User", UserSchema);
module.exports = User;