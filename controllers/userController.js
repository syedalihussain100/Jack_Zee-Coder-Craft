const bcrypt = require("bcryptjs");
const { userModel } = require("../models/userModel");
// const { config } = require("dotenv");
// const generateToken = require("../utils/Token");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../utils/Mail");
const { verificationModel } = require("../models/verificationToken");
const { isValidObjectId } = require("mongoose");
const CloudUploadImage = require("../utils/CloudniaryCloud/Cloudinary");

const sendEmail = require("../utils/sendEmail");
// const crypto = require("crypto");


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

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// register api
const registerUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);

    const user = new userModel({
      riderName: req.body.riderName,
      organizationName:req.body.organizationName,
      email: req.body.email,
      password: spassword,
      mobile: req.body.mobile,
      vehiclenumberplate: req.body.vehiclenumberplate,
      crNumber:req.body.crNumber
    });

    const OTP = generateOTP();
    const verificationToken = new verificationModel({
      owner: user._id,
      token: OTP,
    });

    const userData = await userModel.findOne({ email: req.body.email });

    if (userData) {
      res
        .status(200)
        .send({ success: false, msg: "This email is already exits" });
    } else {
      await verificationToken.save();
      const userData = await user.save();

      await sendOTTp(userData.email, OTP);

      res.status(200).send({ success: true, data: userData });
    }
  } catch (error) {
    console.log(error?.message);
    res.status(400).send(error?.message);
  }
};

// login api

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await userModel.findOne({ email: email });

    const token = jwt.sign({ id: userData._id }, process.env.JWT, {
      expiresIn: "1d",
    });

 

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData?.password);

      if (passwordMatch) {
        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          token: token,
        };

        return res
          .status(200)
          .send({ msg: "Login Successfully", data: userResult });
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

// single profile

const singleProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const single_profile = await userModel.findById(id);

    if (!single_profile) {
      res.status(400).send("User Details Not found");
    }

    return res.status(200).send(single_profile);
  } catch (error) {
    return res.status(400).send(error?.message);
  }
};

// profile update

const profileUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const updateProfile = await userModel.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      { new: true, runValidators: true }
    );

    if (!updateProfile) {
      res.status(200).send("Something Error!");
    }

    res
      .status(200)
      .send({ success: true, msg: "Your Profile has been Updated!" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// update profile image
const uploadProfileImage = async (req, res) => {
  // checking user id
  const { _id } = req.user;

  const localPath = `public/images/profile/${req.file.filename}`;

  // upload to cloudniary

  let imgUpload = await CloudUploadImage(localPath);

  try {
    await userModel.findByIdAndUpdate(
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

// all profile users

const AllProfile = async (req, res) => {
  try {
    const allusers = await userModel.find({});

    if (!allusers) {
      res.status(400).send("User Are Not found");
    }

    return res.status(200).send(allusers);
  } catch (error) {
    return res.status(400).send(error?.message);
  }
};

// update password

const UpdatePassword = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;

    if (!user_id || !password) {
      res.status(400).send("All fields are required");
    } else {
      const data = await userModel.findOne({ _id: user_id });

      if (data) {
        const newPassword = await securePassword(password);

        const userData = await userModel.findByIdAndUpdate(
          { _id: user_id },
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
    res.status(200).send(error.message);
  }
};

// forget password

const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await userModel.findOne({ email: email });

    if (userData) {
      const randomString = randomstring.generate();
      const data = await userModel.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );

      // const resetPasswordurl = `${req.protocol}://${req.get(
      //   "host"
      // )}/reset-password?token=${randomString}`;

      const resetPasswordurl = `http://localhost:3000/reset-password?token=${randomString}`;

      await sendEmail({
        email: userData.email,
        subject: "Reset Your Password",
        html:
          "<h3> Hii " +
          userData.email +
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
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
};

// reset password

const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;

    const tokenData = await userModel.findOne({ token: token });

    if (tokenData) {
      const password = req.body.password;
      const newPassword = await securePassword(password);
      const userData = await userModel.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: newPassword, token: "" } },
        { new: true }
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
    res.status(400).send({ success: false, error: error.message });
  }
};



// Verify Email

const VerifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp.trim()) {
      return res.status(400).send("Invalid request, missing parameters!");
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).send("Invalid user id");
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).send("Sorry, user not found!");
    }

    if (user.verified) {
      return res.status(400).send("This account is already verified!");
    }

    const token = await verificationModel.findOne({ owner: user._id });

    if (!token) {
      return res.status(400).send("Sorry, user not found!");
    }

    const isMatched = await token.compareToken(otp);

    if (!isMatched) {
      return res.status(400).send("Please Provide a Valid Token!");
    }

    user.verified = true;

    await verificationModel.findByIdAndDelete(token._id);

    await user.save();

    await verifiedEmail(user.email);

    res
      .status(200)
      .send({ success: true, message: "Your Email is Verified", data: user });
  } catch (error) {
    res.status(400).send(error.message);
  }
};




module.exports = {
  registerUser,
  loginUser,
  singleProfile,
  AllProfile,
  UpdatePassword,
  forgetPassword,
  resetPassword,
  profileUpdate,
  VerifyEmail,
  uploadProfileImage,
};
