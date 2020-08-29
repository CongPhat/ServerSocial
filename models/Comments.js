const mongoose = require("mongoose");

const CommentsSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  idCommentParrent: {
    type: String,
    // required: true,
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

module.exports = mongoose.model("Comments", CommentsSchema);
