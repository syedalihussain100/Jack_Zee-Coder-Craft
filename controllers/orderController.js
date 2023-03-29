const { orderModel } = require("../models/OrderModel");

// create Order
const orderCreate = async (req, res) => {
  try {
    const {
      roname,
      reciever_name,
      mobile,
      address,
      nearest_landmark,
      order_details,
      Orderstatus,
      PaymentStatus,
    } = req.body;

    let data = await orderModel({
      roname: roname,
      reciever_name: reciever_name,
      mobile: mobile,
      address: address,
      nearest_landmark: nearest_landmark,
      order_details: order_details,
      Orderstatus: Orderstatus,
      PaymentStatus: PaymentStatus,
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
      .populate("roname", [
        "riderName",
        "organizationName",
        "crNumber",
        "vehiclenumberplate",
        "email",
        "profilePhoto",
        "mobile",
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
      .populate("roname", [
        "riderName",
        "organizationName",
        "crNumber",
        "vehiclenumberplate",
        "email",
        "profilePhoto",
        "mobile",
      ]);

    if (!orderDetail) {
      return res.status(400).send("Something Error");
    }

    res.status(200).send(orderDetail);
  } catch (error) {
    res.status(500).send(error?.message);
  }
};

// order  status 
const orderStatus = async (req,res) =>{
  try {
    const {id} = req.params;

    const newuserData = {
      Orderstatus: req.body.Orderstatus,
    };
    const orderStatus  = await orderModel.findByIdAndUpdate(id,newuserData,{
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success:true,
      message: "Your Order Status has been Updated",
      orderStatus
    })
  } catch (error) {
    res.status(500).send(error?.message);
  }
}

// exports
module.exports = {
  orderCreate,
  orderDetails,
  ordersAll,
  orderStatus
};
