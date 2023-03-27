const mongoose = require("mongoose");

const Order = mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please User Author is required!"],
  },
  organization_User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: [true, "Please Organization Author is required"],
  },
  reciever_name: {
    type: String,
    required: [true, "Please Name is Required!"],
    trim: true,
  },

  mobile: {
    type: String,
    required: [true, "Please Mobile Number is Required!"],
    trim: true,
  },

  address: {
    type: String,
    required: [true, "Please Address is Required!"],
    trim: true,
  },
  nearest_landmark: {
    type: String,
    required: [true, "Please Nearest Landmark is Required!"],
    trim: true,
  },

  order_details: {
    type: String,
    required: [true, "Please Order Details is Required!"],
    trim: true,
  },

  payment_status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.model("Order", Order);

module.exports = { orderModel };