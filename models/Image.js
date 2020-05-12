const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  meta_data: {},
});

module.exports = Image = mongoose.model("image", ImageSchema);
