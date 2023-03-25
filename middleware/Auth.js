const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
 
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];


      if (token) {
        const decoded = jwt.verify(token, process.env.JWT);
        // find the user by id
        const user = await userModel.findById(decoded?.id);
          console.log(user)
        // attach the user to the request
        req.user = user;
        console.log(req.user._id || "koi issue haai");
        next();
      } else {
        res.status(404);
        throw new Error("There is no token attached to the header");
      }
    } catch (error) {
      res.status(401).send("No authorized token expired, login again");
    }
  } else {
    res.status(400).send("There is no token attached to the header");
  }
};


module.exports = authMiddleware;
