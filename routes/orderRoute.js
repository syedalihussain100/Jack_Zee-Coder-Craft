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
const authorizeRoles = require("../middleware/Role")


order_Route.use(express.json());
order_Route.use(bodyParser.json());
order_Route.use(bodyParser.urlencoded({ extended: true }));

order_Route.post(
  `/createOrder`,
  authMiddleware,
  authorizeRoles("admin"),
  orderCreate
);
order_Route.get(`/orderDetails/:id`, authMiddleware, orderDetails);
order_Route.get(`/orders`, ordersAll);
order_Route.put(`/orderStatus/:id`, authMiddleware, authorizeRoles("admin"), orderStatus);

module.exports = order_Route;
