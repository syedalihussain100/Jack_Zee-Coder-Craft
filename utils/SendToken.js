 const sendToken = (res, user, statusCode, message) => {
  const token = user.getJWTToken();

  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    password: user.password,
    mobile: user.mobile,
    verified: user.verified,
    riderName: user.riderName,
    organizationName: user.organizationName,
    crNumber: user.crNumber,
    vehiclenumberplate: user.vehiclenumberplate,
    profilePhoto: user.profilePhoto,
    token:token
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, message, user: userData });
};


module.exports = {sendToken}