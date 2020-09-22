const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const userStatus = async (id, status) => {
  const query = { _id: id };
  const update = { online: status };
  let resultUpdate = await User.findOneAndUpdate(
    query,
    update,
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return "Success";
    }
  );
};

const controllerAuth = {
  checkToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, "tokenTiny");
      const result = await User.findOne({ _id: decoded.id }, "_id name");
      req.idToken = decoded.id;
      next();
    } catch {
      res.status(401).json({
        error: new Error("Invalid request!"),
      });
    }
  },
  checkTokenGraphql: async (token) => {
    const tokenSplit = token.split(" ")[1];
    const decoded = jwt.verify(tokenSplit, "tokenTiny");
    const result = await User.findOne({ _id: decoded.id }, "_id name");
    if (result) {
      return result;
    }
    return Promise.reject("User not exit");
  },
  userOnline: async (id) => {
    userStatus(id, true);
  },
  userOffline: async (id) => {
    userStatus(id, false);
  },
};
module.exports = controllerAuth;
