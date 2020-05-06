const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  sender: {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    name: {
      type: String
    },
    text: {
      type: String
    },
  },
  dare: {
    type: Schema.Types.ObjectId,
    ref: "dares",
  },
  reply: [
    {
      user: {
        type: Schema.Types.ObjectId,
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

module.exports = Post = mongoose.model("post", PostSchema);
