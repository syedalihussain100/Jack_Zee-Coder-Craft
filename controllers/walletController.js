const { userModel } = require("../models/userModel");

// wallet controller
const wallet = async (req, res) => {
  const { _id } = req.user;
  const { balance } = req.body;

  try {
    let data = await userModel.findByIdAndUpdate(
      _id,
      { $inc: { balance: balance } },
      { new: true, runValidators: true }
    );
    res.status(200).send({
      status: true,
      message: "Your Wallet has been Updated",
      data: data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// get user per wallet
const walletUser = async (req, res) => {
  const { _id } = req.user;

  try {
    let data = await userModel.findById(_id,"balance");
    res.status(200).send({
      status: true,
      message: "Your Total Wallet",
      data: data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { wallet, walletUser };
