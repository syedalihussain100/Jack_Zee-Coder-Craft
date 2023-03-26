const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const organizationVerificationTokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: '2m',
    default: Date.now(),
  },
});

organizationVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    const hash = await bcrypt.hash(this.token, 8);

    this.token = hash;
  }

  next();
});

organizationVerificationTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compareSync(token, this.token);

  return result
};


const organizationVerificationModel = mongoose.model("OrganizationVerificationToken",organizationVerificationTokenSchema);

module.exports = {organizationVerificationModel}