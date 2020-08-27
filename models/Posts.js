const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  image: { type: String, required: true },
  userId: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Posts", PostSchema);
