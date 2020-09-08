const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  image: { type: String },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Users",
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
