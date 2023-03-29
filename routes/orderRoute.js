const express = require("express");
const order_Route = express.Router();
const bodyParser = require("body-parser");

const {
  orderCreate,
  orderDetails,
  ordersAll,
} = require("../controllers/orderController");
const Authmiddleware = require("../middleware/Auth");

order_Route.use(express.json());
order_Route.use(bodyParser.json());
order_Route.use(bodyParser.urlencoded({ extended: true }));

order_Route.post(`/createOrder`, Authmiddleware, orderCreate);
order_Route.get(`/orderDetails/:id`, Authmiddleware, orderDetails);
order_Route.get(`/orders`, ordersAll);

module.exports = order_Route;
