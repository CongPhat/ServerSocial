const express = require("express");
const Post = require("../../models/Posts");
const User = require("./../../models/Users");
const Comment = require("./../../models/Comments");
const message = require("./../../helper/messageResponse");
const jwt = require("jsonwebtoken");

const route = express.Router();

route.get("/:id", async (req, res) => {
  const idPost = req.params.id;
  await Comment.find({ postId: idPost, idCommentParrent: "" }, (err, data) => {
    if (err) {
      res.status(404).send({
        status: 404,
        message: "Not Found",
      });
      return;
    }
    const resultUserComment = Promise.all(
      data.map(async (item) => {
        const userFind = await User.findOne({ _id: item.userId }, "name image");
        return {
          ...item._doc,
          user: userFind,
        };
      })
    );
    resultUserComment.then((data) => {
      res.json(message.messageSuccess("Success", data));
    });
  });
});

route.post("/", async (req, res) => {
  const { id } = jwt.decode(req.headers.authorization);
  if (!id)
    return res.status(401).send({
      status: 401,
      message: "Authen",
    });
  const comment = new Comment({
    content: req.body.comment,
    postId: req.body.id,
    user: id,
    idCommentParrent: req.body.idParentComment || "",
  });
  await comment
    .save()
    .then(async (data) => {
      const userFind = await User.findOne({ _id: data.user }, "image name");
      const dataSend = {
        ...data._doc,
        user: userFind,
        childs: [],
      };
      res.json(message.messageSuccess("Success", dataSend));
    })
    .catch((error) => {
      console.log(error);
      res.status("404").send(error.message);
    });
});

route.get("/:id", async (req, res) => {
  await Post.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(404).send({
        status: 404,
        message: "Not Found",
      });
      return;
    }
    res.json(data);
  });
});

route.post("/:idUser", async (req, res) => {
  const post = new Post({
    content: req.body.content,
    userId: req.params.idUser,
    image: req.body.image,
  });
  await post
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status("404").send(error.message);
    });
});

route.put("/:id", async (req, res) => {
  const query = { _id: req.params.id };
  const update = { content: req.body.content, image: req.body.image };

  let result = await Post.findOneAndUpdate(
    query,
    update,
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
    }
  );
  res.json(result);
});

route.delete("/:id", async (req, res) => {
  const query = { _id: req.params.id };

  let result = await Post.findOneAndDelete(query, function (err, doc) {
    if (err) return res.send(500, "Lỗi");
    return res.send("Delete Success");
  });
});

module.exports = route;
