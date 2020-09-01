const express = require("express");
const Joi = require("joi");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

//server socket
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
users = {};
server.listen(3001);
//

require("dotenv/config");
app.use(
  cors({
    origin: ["http://localhost:6969", "https://congphat.github.io"],
  })
);
app.use(bodyParser.json());
app.set("socketio", io);

const PostRouter = require("./routes/posts");
const UserRouter = require("./routes/users");
const CommentRouter = require("./routes/comments");
const MessageRouter = require("./routes/message");

app.get("/", (req, res) => {
  res.send("Let's goooooo");
});
app.use("/post", PostRouter);
app.use("/user", UserRouter);
app.use("/comment", CommentRouter);
app.use("/message", MessageRouter);

mongoose.connect(
  process.env.MONGOODB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connect DB");
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`On ${port}`);
});

io.sockets.on("connection", function (socket) {
  console.log(socket.id);
  console.log(socket.client.conn.server.clientsCount);
  socket.on("new user", function (name, data) {
    console.log(name);
    console.log(data);
    // if (name in users) {
    //   data(false);
    // } else {
    //   data(true);
    //   socket.nickname = name;
    //   users[socket.nickname] = socket;
    //   console.log("add nickName");
    //   // updateNickNames();
    // }
  });
});
