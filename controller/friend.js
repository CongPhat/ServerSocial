// const Message = require("./../models/Message");
const Users = require("./../models/Users");
const jwt = require("jsonwebtoken");

const controllerFriend = {
  getFriend: async (id) => {
    const listFriend = await Users.findOne(
      {
        _id: id,
      },
      "friend"
    );
    //   .skip(0* 10)
    //   .limit(10)
    //   .sort({ date: "desc" })
    // const listMessageConver = listMessage.map((item) => ({
    //   ...item._doc,
    //   isSend: item.userSend._id,
    // }));
    const dataUser = await Promise.all(
      listFriend.friend.map(async (item) => {
        const data = await Users.findOne(
          { _id: item.idFriend },
          "name image description"
        );
        return data;
      })
    );
    return dataUser;
    throw new Error("error");
  },
  getFriendsOnline: async (id) => {
    const listFriendOnline = await Users.findOne(
      {
        _id: id,
      },
      "friend"
    );
    const dataUser = await Promise.all(
      listFriendOnline.friend.map(async (item) => {
        const data = await Users.findOne(
          { _id: item.idFriend, online: true },
          "name image description"
        );
        return data;
      })
    );
    const dataUserResult = dataUser.filter((item) => item != null);
    return dataUserResult;
    throw new Error("error");
  },
  //   createMessage: async (text, id, idUser) => {
  //     let dataReceive;
  //     const newMessage = new Message({
  //       content: text,
  //       userSend: id,
  //       userReceive: idUser,
  //       user: [id, idUser],
  //     });
  //     await newMessage
  //       .save()
  //       .then(async (data) => {
  //         const userSend = await Users.findOne(
  //           { _id: data.userSend },
  //           "image name"
  //         );
  //         const userReceive = await Users.findOne(
  //           { _id: data.userReceive },
  //           "image name"
  //         );
  //         data.userSend = userSend;
  //         data.isSend = userSend._id;
  //         data.userReceive = userReceive;
  //         dataReceive = data;
  //         return data;
  //       })
  //       .catch((error) => {
  //         throw new Error("Error");
  //       });
  //     return dataReceive;
  //   },
};
module.exports = controllerFriend;
