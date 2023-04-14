const express = require("express");
const wallet_Route = express.Router();
const bodyParser = require("body-parser");
const authMiddleware = require("../middleware/Auth");
const walletController = require("../controllers/walletController");

wallet_Route.use(bodyParser.json());
wallet_Route.use(bodyParser.urlencoded({ extended: true }));

wallet_Route.put(`/balance`, authMiddleware, walletController.wallet);
wallet_Route.get(`/total`, authMiddleware, walletController.walletUser);



module.exports = wallet_Route;