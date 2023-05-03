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
    let data = await userModel.findById(_id, "balance");
    res.status(200).send({
      status: true,
      message: "Your Total Wallet",
      data: data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// remove wallet

const removeWallet = async (req, res) => {
  const { _id } = req.user;

  try {
    let wallet = await userModel.findOne(_id);

    if (!wallet) {
      // Return an error response if the wallet is not found
      return res.status(404).json({ error: "Wallet not found" });
    }

    // Update the wallet amount to 0
    wallet.balance = 0;
    await wallet.save();

    // Return a success response
    return res.json({ message: "Wallet amount cleared" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { wallet, walletUser,removeWallet };
