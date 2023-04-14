const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT);

        // find the user by id
        const user = await userModel.findById(decoded?._id);

        // attach the user to the request
        req.user = user;
        console.log(req.user);
        next();
      } else {
        res.status(404).send("There is no token attached to the header");
      }
    } catch (error) {
      res.status(401).send("No authorized token expired, login again");
    }
  } else {
    res.status(400).send("There is no token attached to the header");
  }
});

// const authMiddleware = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;

//     if (!token) {
//       return res.status(401).json({ success: false, message: "Login First" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT);

//     req.user = await userModel.findById(decoded._id);

//     console.log(req.user)

//     next();
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

module.exports = authMiddleware;
