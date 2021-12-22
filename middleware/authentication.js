require("dotenv").config();
const jwt = require("jsonwebtoken");
const Users = require("../model/user");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = await jwt.verify(token, process.env.TOKEN_KEY);
    const verifyToken = await Users.findOne({
      _id: decode._id,
      "tokens.token": token,
    });
    if (!verifyToken) throw new Error();
    req.token = token;
    next();
  } catch (e) {
    res.status(400).send({ error: "authentication X" });
  }
};

module.exports = auth;
