const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
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

module.exports = Post = mongoose.model("post", PostSchema);
