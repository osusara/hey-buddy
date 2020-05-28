const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  bio: {
    type: String,
  },
  gender: {
    type: String,
  },
  relationship: {
    type: String,
  },
  address: {
    type: String,
  },
  interests: {
    type: [String],
  },
  social: {
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  score: {
    type: Number,
    required: true,
  },
  privacy: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
