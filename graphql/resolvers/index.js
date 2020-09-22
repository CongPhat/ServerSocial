const resolverMessage = require("./message");
const resolverFriend = require("./friend");
module.exports = {
  ...resolverMessage,
  ...resolverFriend,
};
