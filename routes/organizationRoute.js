const express = require("express");
const organization_Route = express.Router();
const bodyParser = require("body-parser");
const {
  organizationRegister,
  organizationLogin,
  organizationVerifyOtp,
  organizationSingleProfile,
  organizationAllProfiles,
  organizationSingleProfileUpdate,
  organizationProfilePictureUpdate,
  organizationUpdatepassword,
  organizationForgetPassword,
  organizationResetPassword,
} = require("../controllers/organizationController");
const {
  profilePhotoUpload,
  organizationPhotoResize,
} = require("../Uploads/ProfilePhotoUpload");

const organizationAuthMiddleware = require("../middleware/organizationAuth");

organization_Route.use(express.json());
organization_Route.use(bodyParser.json());
organization_Route.use(bodyParser.urlencoded({ extended: true }));

organization_Route.post(`/organization-register`, organizationRegister);
organization_Route.post(`/organization-login`, organizationLogin);
organization_Route.post(`/organization-forget-password`, organizationForgetPassword);
organization_Route.put(`/organization-reset-password`, organizationResetPassword);


organization_Route.post(`/organization-verify-email`, organizationVerifyOtp);
organization_Route.get(`/organization-profile/:id`, organizationAuthMiddleware,organizationSingleProfile);
organization_Route.get(`/organization-all-profiles`, organizationAllProfiles);
organization_Route.put(
  `/organization-update-password`,
  organizationAuthMiddleware,
  organizationUpdatepassword
);

organization_Route.put(
  `/organization-profile-update/:id`,
  organizationAuthMiddleware,
  organizationSingleProfileUpdate
);
organization_Route.put(
  `/organization-profile-picture-update`,
  organizationAuthMiddleware,
  profilePhotoUpload.single("organization-image"),
  organizationPhotoResize,
  organizationProfilePictureUpdate
);



module.exports = organization_Route;
