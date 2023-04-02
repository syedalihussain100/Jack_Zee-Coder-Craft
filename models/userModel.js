const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

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
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  otp: Number,
  otp_expiry: Date,
});


user.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



user.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT, {
    expiresIn: '24h', // expires in 24 hours
  });
};

user.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



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

user.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 })


const userModel = mongoose.model("User", user);

module.exports = { userModel };
