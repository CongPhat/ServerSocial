const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  // roomMessage: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  //   ref: "RoomMessage",
  // },
  user: {
    type: [String],
    required: true,
    ref: "Users",
  },
  userSend: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  userReceive: {
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

module.exports = mongoose.model("Message", MessageSchema);
