const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomMessageSchema = mongoose.Schema({
  user: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "Users",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RoomMessage", RoomMessageSchema);
