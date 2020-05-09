const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  text: {
    type: String,
    required: true
  },
  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  highfives: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
  close: {
    type: Boolean,
    default: false,
  },
});

module.exports = Challenge = mongoose.model("challenge", ChallengeSchema);
