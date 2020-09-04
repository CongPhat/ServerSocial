const express = require("express");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const message = require("./../../helper/messageResponse");
const User = require("../../models/Users");
const Post = require("../../models/Posts");
const Comment = require("../../models/Comments");
var ObjectId = require("mongoose").Types.ObjectId;

const route = express.Router();

route.get("/", async (req, res) => {
  const dataFind = await User.find();
  res.send(dataFind);
});

route.get("/:id", async (req, res) => {
  console.log(req.params.id);
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
        isOwner: id == req.params.id,
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

route.get("/posts/:id/:page", async (req, res) => {
  const id = req.params.id;
  let result = await Post.find({ userId: id })
    .skip(parseInt(req.params.page))
    .limit(9);
  const resultPostComment = Promise.all(
    result.map(async (item) => {
      const totalComment = await Comment.countDocuments({ postId: item._id });
      return {
        ...item._doc,
        totalComment,
      };
    })
  );
  resultPostComment.then((data) => {
    res.json(message.messageSuccess("Success", data));
  });
});

route.get("/post-user/:id", async (req, res) => {
  const id = req.params.id;
  let result = await Post.findOne({ _id: new ObjectId(id) });
  if (!result) res.status("400").send("Không tìm thấy bài viết này");
  let resultUser = await User.findOne({ _id: result.userId }, "image name");

  console.time("result_comment");
  let resultComment = await Comment.find({ postId: id }).populate(
    "user",
    "name image"
  );
  console.timeEnd("result_comment");

  const dataComment = resultComment.filter(
    (item) => item.idCommentParrent === ""
  );
  const dataCommentChild = resultComment.filter(
    (item) => item.idCommentParrent !== ""
  );

  const dataCommentParrent = dataComment.map((itemComment) => {
    const dataFilter = dataCommentChild.filter((itemFilter) => {
      return itemFilter.idCommentParrent == itemComment._id;
    });
    return {
      ...itemComment._doc,
      childs: dataFilter,
    };
  });

  const response = {
    ...result._doc,
    user: resultUser,
    comments: dataCommentParrent,
  };
  res.json(message.messageSuccess("Success", response));
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
  let resultTest = await User.find();
  let result = await User.findOne({ email: req.body.email });
  if (result) {
    if (result.password === passwordMd5) {
      const token = jwt.sign(
        {
          email: req.body.email,
          id: result._id,
          image: result.image,
          name: result.name,
        },
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
