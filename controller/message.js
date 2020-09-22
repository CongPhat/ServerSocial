const Message = require("./../models/Message");
const Users = require("./../models/Users");
const jwt = require("jsonwebtoken");

const controllerMessage = {
  getMessage: async (id, idUser, payload) => {
    const listMessage = await Message.find({
      user: { $all: [id, idUser] },
    })
      .sort({ date: "desc" })
      .skip(payload * 10)
      .limit(10)
      // .reverse()
      .populate("userSend", "image name")
      .populate("userReceive", "image name");
    const listMessageConver = listMessage.map((item) => ({
      ...item._doc,
      isSend: item.userSend._id,
    }));
    return listMessageConver.reverse();
  },
  createMessage: async (text, id, idUser) => {
    let dataReceive;
    const newMessage = new Message({
      content: text,
      userSend: id,
      userReceive: idUser,
      user: [id, idUser],
    });
    await newMessage
      .save()
      .then(async (data) => {
        const userSend = await Users.findOne(
          { _id: data.userSend },
          "image name"
        );
        const userReceive = await Users.findOne(
          { _id: data.userReceive },
          "image name"
        );
        data.userSend = userSend;
        data.isSend = userSend._id;
        data.userReceive = userReceive;
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
