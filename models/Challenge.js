const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  sender: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    name: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  dare: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "dares",
  },
  receivers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
      },
      done: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
        default: Date.now(),
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
