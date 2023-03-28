const express = require("express");
const order_Route = express.Router();
const bodyParser = require("body-parser");

const {
  orderCreate,
  orderDetails,
  ordersAll,
} = require("../controllers/orderController");
const organizationAuth = require("../middleware/organizationAuth");

order_Route.use(express.json());
order_Route.use(bodyParser.json());
order_Route.use(bodyParser.urlencoded({ extended: true }));

order_Route.post(`/createOrder`, organizationAuth, orderCreate);
order_Route.get(`/orderDetails/:id`, organizationAuth, orderDetails);
order_Route.get(`/orders`, ordersAll);

module.exports = order_Route;
