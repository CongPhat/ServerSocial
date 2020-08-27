const express = require("express");
const Post = require("../../models/Posts");
const User = require("./../../models/Users");

const route = express.Router();

const Get = async (id) => {
  return await User.findById(id, (err, data) => {
    Promise.resolve(data);
  });
};

route.get("/", async (req, res) => {
  const dataFind = await Post.find();
  const result = Promise.all(
    dataFind.map(async (item) => {
      const userFind = await User.findOne({ _id: item.userId });
      return {
        ...item._doc,
        user: userFind,
      };
    })
  );
  result.then((data) => {
    res.send(data);
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
