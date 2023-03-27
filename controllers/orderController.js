const { orderModel } = require("../models/OrderModel");

// create Order
const orderCreate = async (req, res) => {
  try {
    const {
      rider,
      organization_User,
      reciever_name,
      mobile,
      address,
      nearest_landmark,
      order_details,
      Orderstatus,
    } = req.body;

    let data = await orderModel({
      rider: rider,
      organization_User: organization_User,
      reciever_name: reciever_name,
      mobile: mobile,
      address: address,
      nearest_landmark: nearest_landmark,
      order_details: order_details,
      Orderstatus: Orderstatus,
    });

    if (!data) {
      return res.status(200).send("Network Error!");
    }

    const result = await data.save();

    res.status(200).send({
      success: true,
      message: "Your Order has been Completed",
      result: result,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// find all orders
const ordersAll = async (req, res) => {
  try {
    const ordersall = await orderModel
      .find({})
      .populate("organization_User", [
        "profilePhoto",
        "organizationName",
        "crNumber",
        "email",
        "mobile",
      ])
      .populate("rider", [
        "name",
        "email",
        "profilePhoto",
        "mobile",
        "verified",
        "vehiclenumberplate"
      ]);

    if (!ordersall) {
      return res.status(400).send("Something Error");
    }

    res.status(200).send(ordersall);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// find details order

const orderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDetail = await orderModel
      .findById(id)
      .populate("organization_User", [
        "profilePhoto",
        "organizationName",
        "crNumber",
        "email",
        "mobile",
      ])
      .populate("rider", [
        "name",
        "email",
        "profilePhoto",
        "mobile",
        "verified"
      ])

    if (!orderDetail) {
      return res.status(400).send("Something Error");
    }

    res.status(200).send(orderDetail);
  } catch (error) {
    res.status(500).send(error?.message);
  }
};

// exports
module.exports = {
  orderCreate,
  orderDetails,
  ordersAll,
};
