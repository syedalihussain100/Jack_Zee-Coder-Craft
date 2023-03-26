const mongoose = require("mongoose");
const crypto = require("crypto");

const organization = mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
    trim: true,
  },
  crNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
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

const organizationModel = mongoose.model("Organization", organization);

module.exports = { organizationModel };
