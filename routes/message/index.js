const express = require("express");
const Post = require("../../models/Posts");
const User = require("./../../models/Users");
const Message = require("./../../models/Message");
const RoomMessage = require("./../../models/RoomMessage");
const message = require("./../../helper/messageResponse");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

const route = express.Router();

route.get("/:id", async (req, res) => {
  const { id } = jwt.decode(req.headers.authorization);
  if (!id)
    return res.status(401).send({
      status: 401,
      message: "Authen",
    });
  const idUserMessage = req.params.id;
  if (
    !mongoose.Types.ObjectId.isValid(idUserMessage) ||
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    res.status("400").send(res.json(message.messageError("Error Id")));
  }
  const roomMessage = await RoomMessage.findOne({
    user: { $all: [id, idUserMessage] },
  });
  if (roomMessage) {
    const listMessage = await Message.find({
      roomMessage: roomMessage._id,
    }).populate("userSend", "image name");
    const listMessageConver = listMessage.map((item) => ({
      ...item._doc,
      isSend: item.userSend._id == id,
    }));
    res.json(message.messageSuccess("Success", listMessageConver));
  } else {
    res.json(message.messageSuccess("Success", []));
  }

  // await Comment.find({ postId: idPost, idCommentParrent: "" }, (err, data) => {
  //   if (err) {
  //     res.status(404).send({
  //       status: 404,
  //       message: "Not Found",
  //     });
  //     return;
  //   }
  //   const resultUserComment = Promise.all(
  //     data.map(async (item) => {
  //       const userFind = await User.findOne({ _id: item.userId }, "name image");
  //       return {
  //         ...item._doc,
  //         user: userFind,
  //       };
  //     })
  //   );
  //   resultUserComment.then((data) => {
  //     res.json(message.messageSuccess("Success", data));
  //   });
  // });
});

route.post("/", async (req, res) => {
  //   console.log(jwt.decode(req.headers.authorization));
  //   const { id } = jwt.decode(req.headers.authorization);
  //   if (!id)
  //     return res.status(401).send({
  //       status: 401,
  //       message: "Authen",
  //     });

  const userIdReceive = req.body.idUser;
  const userId = req.body.id;
  if (
    !mongoose.Types.ObjectId.isValid(userIdReceive) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    res.status("400").send(res.json(message.messageError("Error Id")));
  }
  const respon = await RoomMessage.findOne({
    user: { $all: [userIdReceive, userId] },
  });
  if (respon) {
    const newMessage = new Message({
      content: req.body.content,
      userSend: userId,
      roomMessage: respon._id,
    });
    await newMessage
      .save()
      .then(async (data) => {
        res.json(message.messageSuccess("Success", data));
      })
      .catch((error) => {
        res.status("404").send(error.message);
      });
  } else {
    const newRoomMessage = new RoomMessage({
      user: [userId, userIdReceive],
    });
    await newRoomMessage
      .save()
      .then(async (data) => {
        const newMessage = new Message({
          content: req.body.content,
          userSend: userId,
          roomMessage: data._id,
        });
        await newMessage
          .save()
          .then(async (data) => {
            res.json(message.messageSuccess("Success", data));
          })
          .catch((error) => {
            res.status("404").send(error.message);
          });
      })
      .catch((error) => {
        console.log(error, "erro");
        res.status("404").send(error.message);
      });
  }
});

// route.get("/:id", async (req, res) => {
//   await Post.findById(req.params.id, (err, data) => {
//     if (err) {
//       res.status(404).send({
//         status: 404,
//         message: "Not Found",
//       });
//       return;
//     }
//     res.json(data);
//   });
// });

// route.post("/:idUser", async (req, res) => {
//   const post = new Post({
//     content: req.body.content,
//     userId: req.params.idUser,
//     image: req.body.image,
//   });
//   await post
//     .save()
//     .then((data) => {
//       res.json(data);
//     })
//     .catch((error) => {
//       res.status("404").send(error.message);
//     });
// });

// route.put("/:id", async (req, res) => {
//   const query = { _id: req.params.id };
//   const update = { content: req.body.content, image: req.body.image };

//   let result = await Post.findOneAndUpdate(
//     query,
//     update,
//     { upsert: true },
//     function (err, doc) {
//       if (err) return res.send(500, { error: err });
//     }
//   );
//   res.json(result);
// });

// route.delete("/:id", async (req, res) => {
//   const query = { _id: req.params.id };

//   let result = await Post.findOneAndDelete(query, function (err, doc) {
//     if (err) return res.send(500, "Lỗi");
//     return res.send("Delete Success");
//   });
// });

module.exports = route;
