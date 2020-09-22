const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friend: {
    type: Array,
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  online: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Users", UserSchema);
