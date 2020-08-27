const express = require("express");
const Joi = require("joi");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv/config");
app.use(
  cors({
    origin: ["http://localhost:6969", "https://congphat.github.io"],
  })
);
app.use(bodyParser.json());

const PostRouter = require("./routes/posts");
const UserRouter = require("./routes/users");

app.get("/", (req, res) => {
  res.send("Let's goooooo");
});

app.use("/post", PostRouter);
app.use("/user", UserRouter);

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
