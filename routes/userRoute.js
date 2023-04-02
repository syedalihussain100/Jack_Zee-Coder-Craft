const express = require("express");
const user_Route = express.Router();
const bodyParser = require("body-parser");
const userController = require("../controllers/userController");
const Authmiddleware = require("../middleware/Auth");
const {
  profilePhotoUpload,
  profilePhotoResize,
} = require("../Uploads/ProfilePhotoUpload");

user_Route.use(bodyParser.json());
user_Route.use(bodyParser.urlencoded({ extended: true }));

user_Route.post(`/register`, userController.registerUser);
user_Route.post(`/login`, userController.loginUser);
user_Route.get(`/profile/:id`, Authmiddleware, userController.singleProfile);
user_Route.put(
  `/profile-update/:id`,
  Authmiddleware,
  userController.profileUpdate
);
user_Route.put(
  `/upload/profile-photo`,
  Authmiddleware,
  profilePhotoUpload.single("image"),
  profilePhotoResize,
  userController.uploadProfileImage
);
user_Route.get(`/users/profile`, Authmiddleware, userController.AllProfile);
user_Route.get(`/logout`, userController.logout);

user_Route.post(
  `/update-password`,
  Authmiddleware,
  userController.UpdatePassword
);

user_Route.post(`/forget-password`, userController.forgetPassword);
// user_Route.post(`/logout`, Authmiddleware, userController.signOut);
user_Route.post(`/verify-email`, Authmiddleware,userController.verify);

user_Route.put(`/reset-password`, userController.resetPassword);

module.exports = user_Route;
