
exports.generateOTP = () => {
    let otp = "";

  for (let i = 1; i <= 6; i++) {
    const rndVal = Math.round(Math.random() * 9);
    otp = otp + rndVal;
  }

  return otp
};