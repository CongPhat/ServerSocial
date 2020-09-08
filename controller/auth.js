const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const controllerAuth = {
  checkToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, "tokenTiny");
      const result = await User.find({ _id: decoded.id }, "_id name");
      req.idToken = decoded.id;
      next();
    } catch {
      res.status(401).json({
        error: new Error("Invalid request!"),
      });
    }
  },
};
module.exports = controllerAuth;
