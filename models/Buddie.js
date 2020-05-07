const mongoose = require("mongoose");

const BuddySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  buddies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      special: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

module.exports = Buddy = mongoose.model("buddy", BuddySchema);
