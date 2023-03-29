const mongoose = require("mongoose");
const crypto = require("crypto");

const user = mongoose.Schema({
  riderName: {
    type: String,
    trim: true,
    default: "",
  },
  organizationName: {
    type: String,
    trim: true,
    default: "",
  },

  crNumber: {
    type: String,
    trim: true,
    default: "",
  },

  vehiclenumberplate: {
    type: String,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },

  mobile: {
    type: String,
    required: true,
  },

  token: {
    type: String,
    default: "",
  },

  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
});

// reset password

user.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding to Schema

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const userModel = mongoose.model("User", user);

module.exports = { userModel };
