const Post = require("../models/Posts");
const User = require("../models/Users");
const Comment = require("../models/Comments");
const message = require("../helper/messageResponse");

const controller = {
  insert: async (req, res, next) => {
    const filePath = req.file
      ? `http://192.168.10.243:3000/img/${req.file.filename}`
      : "";
    const newPost = new Post({
      content: req.body.content || "",
      userId: req.idToken,
      image: filePath,
    });
    await newPost
      .save()
      .then(async (data) => {
        const dataUserFind = await User.findOne(
          { _id: data.userId },
          "image name"
        );
        const dataSend = {
          ...data._doc,
          user: dataUserFind,
          comments: [],
        };
        res.json(message.messageSuccess("Success", dataSend));
      })
      .catch((error) => {
        res.status("404").send(error.message);
      });
  },
  getData: async (req, res, next) => {
    const dataFind = await Post.find().sort({ date: "desc" });
    const result = Promise.all(
      dataFind.map(async (item) => {
        const userFind = await User.findOne({ _id: item.userId }, "image name");
        const commentFind = await Comment.find({
          postId: item._id,
          idCommentParrent: "",
        }).populate("user", "name");
        return {
          ...item._doc,
          user: userFind,
          comments: commentFind,
        };
      })
    );
    result.then((data) => {
      res.send(data);
    });
  },
};
module.exports = controller;
