const express = require("express");
const order_Route = express.Router();
const bodyParser = require("body-parser");

const {
 orderCreate,
 orderGet,
 orderDetails,
 orderStatus
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/Auth");


order_Route.use(express.json());
order_Route.use(bodyParser.json());
order_Route.use(bodyParser.urlencoded({ extended: true }));


order_Route.post(`/create`,authMiddleware,orderCreate);
order_Route.get(`/orders`,authMiddleware,orderGet);
order_Route.get(`/order/:id`,authMiddleware,orderDetails);
order_Route.put(`/update/:id`,authMiddleware,orderStatus);




module.exports = order_Route;
