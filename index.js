const express = require("express");
const Joi = require("joi");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const multer = require("multer");

const mongoUrl =
  "mongodb://192.168.10.243:27017/phatdb?retryWrites=true&w=majority";
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
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer().array());
app.set("socketio", io);

const PostRouter = require("./routes/posts");
const UserRouter = require("./routes/users");
const CommentRouter = require("./routes/comments");
const MessageRouter = require("./routes/message");

app.get("/", (req, res) => {
  res.send("Let's goooooo thooii");
});
app.use("/post", PostRouter);
app.use("/user", UserRouter);
app.use("/comment", CommentRouter);
app.use("/message", MessageRouter);
app.use("/img", express.static("public/images"));

const connectWithRetry = function () {
  // when using with docker, at the time we up containers. Mongodb take few seconds to starting, during that time NodeJS server will try to connect MongoDB until success.
  return mongoose.connect(
    mongoUrl,
    { useNewUrlParser: true, useFindAndModify: false },
    (err) => {
      if (err) {
        console.error(
          "Failed to connect to mongo on startup - retrying in 5 sec",
          err
        );
        setTimeout(connectWithRetry, 5000);
      } else {
        console.log("Connect");
      }
    }
  );
};
connectWithRetry();

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
