const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  dare: {
    type: Schema.Types.ObjectId,
    ref: "dares",
  },
  reply: [
    {
      receiver: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
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
