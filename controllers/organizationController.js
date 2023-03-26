const bcrypt = require("bcryptjs");
const { organizationModel } = require("../models/organizationModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const {
  organizationVerificationModel,
} = require("../models/organizationVerificationToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP } = require("../utils/Mail");
const CloudUploadImage = require("../utils/CloudniaryCloud/Cloudinary");
const sendEmail = require("../utils/sendEmail");

// secure Password Bcrypt
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// ottp

const sendOTTp = async (email, ottp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      service: "Gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    const mailOptions = {
      from: "jackdelivery121@gmail.com",
      to: email,
      subject: "Verify Your Email",
      html: "<h1>" + ottp + "</h1>",
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Mail has been sent: ", info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
};

// verified email

const verifiedEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      service: "Gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    const mailOptions = {
      from: "jackdelivery121@gmail.com",
      to: email,
      subject: "Verify your email account",
      html: "Email Verified Successfully Thanks for Connecting with us",
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Mail has been sent: ", info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
};

// organization register

const organizationRegister = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);

    const organization = new organizationModel({
      organizationName: req.body.organizationName,
      crNumber: req.body.crNumber,
      email: req.body.email,
      password: spassword,
      mobile: req.body.mobile,
    });

    const OTP = generateOTP();
    const organizationverificationtoken = new organizationVerificationModel({
      owner: organization._id,
      token: OTP,
    });

    const organizationData = await organizationModel.findOne({
      email: req.body.email,
    });

    if (organizationData) {
      res
        .status(200)
        .send({ success: false, msg: "This email is already exits" });
    } else {
      await organizationverificationtoken.save();
      const data = await organization.save();

      await sendOTTp(data?.email, OTP);

      res.status(200).send({ success: true, data: data });
    }
  } catch (error) {
    console.log(error?.message);
    res.status(400).send(error?.message);
  }
};

// organization login

const organizationLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const organizationData = await organizationModel.findOne({ email: email });

    const token = jwt.sign(
      { id: organizationData._id },
      process.env.ORGANIZATIONJWT,
      { expiresIn: "1d" }
    );

    if (organizationData) {
      const passwordMatch = await bcrypt.compare(
        password,
        organizationData?.password
      );

      if (passwordMatch) {
        const result = {
          _id: organizationData?._id,
          organizationName: organizationData?.organizationName,
          crNumber: organizationData?.crNumber,
          email: organizationData?.email,
          password: organizationData?.password,
          mobile: organizationData?.mobile,
          token: token,
        };

        return res
          .status(200)
          .send({ msg: "Login Successfully", data: result });
      } else {
        res
          .status(400)
          .send({ success: false, msg: "Login details are incorrect" });
      }
    } else {
      res
        .status(400)
        .send({ success: false, msg: "Login details are incorrect" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Organization Verify Otp

const organizationVerifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp.trim()) {
      return res.status(400).send("Invalid request, missing parameters!");
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).send("Invalid user id");
    }

    const Organizationuser = await organizationModel.findById(userId);

    if (!Organizationuser) {
      return res.status(400).send("Sorry, user not found!");
    }

    if (Organizationuser.verified) {
      return res.status(400).send("This account is already verified!");
    }

    const token = await organizationVerificationModel.findOne({
      owner: Organizationuser._id,
    });

    if (!token) {
      return res.status(400).send("Sorry, user not found!");
    }

    const isMatched = await token.compareToken(otp);

    if (!isMatched) {
      return res.status(400).send("Please Provide a Valid Token!");
    }

    Organizationuser.verified = true;

    await organizationVerificationModel.findByIdAndDelete(token._id);
    await Organizationuser.save();
    await verifiedEmail(Organizationuser.email);

    res.status(200).send({
      success: true,
      message: "Your Email is Verified",
      data: Organizationuser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Organization Single Profile

const organizationSingleProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const single_profile = await organizationModel.findById(id);

    if (!single_profile) {
      res.status(400).send("User Details Not found");
    }

    return res.status(200).send(single_profile);
  } catch (error) {
    return res.status(400).send(error?.message);
  }
};

// Organization All Profiles

const organizationAllProfiles = async (req, res) => {
  try {
    let allProfiles = await organizationModel.find({});

    if (!allProfiles) {
      res.status(400).send("User Are Not found");
    }

    return res.status(200).send(allProfiles);
  } catch (error) {
    return res.status(400).send(error?.message);
  }
};

// Organization Single Profile Update

const organizationSingleProfileUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const update_Profile = await organizationModel.findByIdAndUpdate(
      id,
      {
        organizationName: req.body.organizationName,
        crNumber: req.body.crNumber,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      { new: true, runValidators: true }
    );

    if (!update_Profile) {
      res.status(200).send("Something Error!");
    }

    res
      .status(200)
      .send({ success: true, msg: "Your Profile has been Updated!" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Organization Single Profile Picture Update
const organizationProfilePictureUpdate = async (req, res) => {
  try {
    // checking user id
    const { _id } = req.user;

    const localPath = `public/images/organization/${req.file.filename}`;

    const imgUpload = await CloudUploadImage(localPath);

    await organizationModel.findByIdAndUpdate(
      _id,
      { profilePhoto: imgUpload?.url },
      { new: true, runValidators: true }
    );

    res.status(200).send({
      message: "Your Profile Picture has been Updated",
      data: imgUpload,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Organization Update Password

const organizationUpdatepassword = async (req, res) => {
  try {
    const organization_id = req.body.organization_id;
    const password = req.body.password;

    if (!organization_id || !password) {
      res.status(400).send("All fields are required");
    } else {
      const data = await organizationModel.findOne({ _id: organization_id });

      if (data) {
        const newPassword = await securePassword(password);

        await organizationModel.findByIdAndUpdate(
          { _id: organization_id },
          {
            $set: { password: newPassword },
          }
        );
        res
          .status(200)
          .send({ success: true, msg: "Your password has been updated" });
      } else {
        res.status(200).send({ success: false, msg: "User Id not found" });
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Organization Forget Password
const organizationForgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const organizationData = await organizationModel.findOne({ email: email });

    if (organizationData) {
      const randomString = randomstring.generate();
      const data = await organizationModel.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );

      const resetPasswordurl = `http://localhost:3000/reset-password?token=${randomString}`;

      await sendEmail({
        email: organizationData?.email,
        subject: "Reset Your Password",
        html:
          "<h3> Hii " +
          organizationData?.organizationName +
          ', Please copy the link and <a href=" ' +
          resetPasswordurl +
          ' ">and reset your password</a></h3>',
      });
      res
        .status(200)
        .send({ success: true, msg: "Please check your inbox of mail" });
    } else {
      res.status(400).send({ success: true, msg: "This email does not exits" });
    }
  } catch (error) {}
};

// Organization Reset Password
const organizationResetPassword = async (req, res) => {
  try {
    const token = req.query.token;

    const tokenData = await organizationModel.findOne({ token: token });

    if (tokenData) {
      const password = req.body.password;
      const newPassword = await securePassword(password);
      const userData = await organizationModel.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: newPassword, token: "" } },
        { new: true, runValidators: true }
      );
      res.status(200).send({
        success: true,
        msg: "User Password has been reset",
        data: userData,
      });
    } else {
      res
        .status(200)
        .send({ success: false, msg: "This link has been expired." });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  organizationRegister,
  organizationLogin,
  organizationVerifyOtp,
  organizationSingleProfile,
  organizationAllProfiles,
  organizationSingleProfileUpdate,
  organizationProfilePictureUpdate,
  organizationUpdatepassword,
  organizationForgetPassword,
  organizationResetPassword
};
