const Message = require("./../models/Message");
const Users = require("./../models/Users");
const jwt = require("jsonwebtoken");
const controllerMessage = {
  getMessage: async (id, idUser) => {
    const listMessage = await Message.find({
      user: { $all: [id, idUser] },
    }).populate("userSend", "image name");
    const listMessageConver = listMessage.map((item) => ({
      ...item._doc,
      isSend: item.userSend._id == id,
    }));
    return listMessageConver;
  },
  createMessage: async (text, id, idUser) => {
    let dataReceive;
    const newMessage = new Message({
      content: text,
      userSend: id,
      user: [id, idUser],
    });
    await newMessage
      .save()
      .then(async (data) => {
        const userSend = await Users.findOne(
          { _id: data.userSend },
          "image name"
        );
        data.userSend = userSend;
        data.isSend = true;
        dataReceive = data;
        return data;
      })
      .catch((error) => {
        throw new Error("Error");
      });
    return dataReceive;
  },
};
module.exports = controllerMessage;
