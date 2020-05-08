const mongoose = require("mongoose");

const DareSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    require: true
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = Dare = mongoose.model("dare", DareSchema);
