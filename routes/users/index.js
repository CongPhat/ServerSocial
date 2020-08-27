const express = require("express");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const message = require("./../../helper/messageResponse");
const User = require("../../models/Users");
const Post = require("../../models/Posts");

const route = express.Router();

route.get("/", async (req, res) => {
  const dataFind = await User.find();
  res.send(dataFind);
});

route.get("/:id", async (req, res) => {
  await User.findById(
    req.params.id,
    "email image name description friend",
    async (err, data) => {
      if (err) {
        res.status(404).send({
          status: 404,
          message: "Not Found",
        });
        return;
      }
      if (!req.headers.authorization) {
        res.status(401).send({
          status: 401,
          message: "Authen",
        });
        return;
      }
      const { id } = jwt.decode(req.headers.authorization);
      const dataFindIdFriend = data.friend.find((item) => item.idFriend === id);
      const dataTotalFriend = data.friend.filter((item) => item.status !== 0);

      const resultTotalPosts = await Post.find({ userId: data._id });
      const dataUserPost = {
        ...data._doc,
        totalPost: resultTotalPosts ? resultTotalPosts.length : 0,
        totalFriend: dataTotalFriend.length,
        friend: undefined,
        isFriend: dataFindIdFriend || null,
      };
      res.json(message.messageSuccess("Success", dataUserPost));
    }
  );
});

const updateFriend = async (idFriend, id, res, action) => {
  const listUser = await User.findOne({ _id: id }, "friend");
  const listFriend = await User.findOne({ _id: idFriend }, "friend");

  let updateUserTemplate;
  let updateFriendTemplate;
  const queryUser = { _id: id };
  const queryFriend = { _id: idFriend };

  switch (action) {
    case "close":
      updateUserTemplate = {
        friend: listUser.friend.filter((item) => item.idFriend !== idFriend),
      };
      updateFriendTemplate = {
        friend: listFriend.friend.filter((item) => item.idFriend !== id),
      };
      break;
    case "success":
      updateUserTemplate = {
        friend: listUser.friend.map((item) => {
          if (item.idFriend === idFriend) {
            return {
              ...item,
              status: 1,
            };
          }
          return item;
        }),
      };
      updateFriendTemplate = {
        friend: listFriend.friend.map((item) => {
          if (item.idFriend === id) {
            return {
              ...item,
              status: 1,
            };
          }
          return item;
        }),
      };
      break;
    case "friend":
      updateUserTemplate = {
        friend: [
          ...listUser.friend,
          {
            idFriend,
            status: 0,
            isOwner: true,
          },
        ],
      };
      updateFriendTemplate = {
        friend: [
          ...listFriend.friend,
          {
            idFriend: id,
            status: 0,
            isOwner: false,
          },
        ],
      };
      break;
  }

  let resultUser = await User.findOneAndUpdate(
    queryUser,
    updateUserTemplate,
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
    }
  );

  let resultFriend = await User.findOneAndUpdate(
    queryFriend,
    updateFriendTemplate,
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
    }
  );

  res.json(message.messageSuccess("Success"));
};

route.get("/friend/:id", async (req, res) => {
  const idFriend = req.params.id;
  const { id } = jwt.decode(req.headers.authorization);
  updateFriend(idFriend, id, res, "friend");
});
route.get("/close-friend/:id", async (req, res) => {
  const idFriend = req.params.id;
  const { id } = jwt.decode(req.headers.authorization);
  updateFriend(idFriend, id, res, "close");
});

route.get("/friend-success/:id", async (req, res) => {
  const idFriend = req.params.id;
  const { id } = jwt.decode(req.headers.authorization);
  updateFriend(idFriend, id, res, "success");
});

route.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    image: req.body.image,
    email: req.body.email,
    password: md5(req.body.password),
  });
  await user
    .save()
    .then((data) => {
      data.password = undefined;
      data = JSON.parse(JSON.stringify(data));
      res.json(data);
    })
    .catch((error) => {
      res.status("404").send(error.message);
    });
});

route.post("/login", async (req, res) => {
  const passwordMd5 = md5(req.body.password);
  let result = await User.findOne({ email: req.body.email });
  if (result) {
    if (result.password === passwordMd5) {
      const token = jwt.sign(
        { email: req.body.email, id: result._id },
        "shhhhh"
      );
      const query = { email: req.body.email };
      const update = { token };
      let resultUpdate = await User.findOneAndUpdate(
        query,
        update,
        { upsert: true },
        function (err, doc) {
          if (err) return res.send(500, { error: err });
        }
      );
      res.json(message.messageSuccess("Success", token));
    }
    return res.send(400, message.messageError("Sai mật khẩu"));
  }
  return res.send(400, message.messageError("Không tìm thấy email hợp lệ"));
});

route.post("/search", async (req, res) => {
  const searchData = req.body.search;
  if (!searchData)
    return res.send(400, message.messageError("Search required"));
  let result = await User.find({ name: searchData }, "name image");
  res.json(message.messageSuccess("Success", result));
});

route.put("/:id", async (req, res) => {
  const query = { _id: req.params.id };
  const update = { title: req.body.title, description: req.body.description };

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