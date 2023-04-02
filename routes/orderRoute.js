const express = require("express");
const order_Route = express.Router();
const bodyParser = require("body-parser");

const {
  orderCreate,
  orderDetails,
  ordersAll,
  orderStatus,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/Auth");


order_Route.use(express.json());
order_Route.use(bodyParser.json());
order_Route.use(bodyParser.urlencoded({ extended: true }));

order_Route.post(
  `/createOrder`,
  authMiddleware,
  orderCreate
);
order_Route.get(`/orderDetails/:id`, authMiddleware, orderDetails);
order_Route.get(`/orders`, authMiddleware,ordersAll);
order_Route.put(`/orderStatus/:id`, authMiddleware,  orderStatus);

module.exports = order_Route;
