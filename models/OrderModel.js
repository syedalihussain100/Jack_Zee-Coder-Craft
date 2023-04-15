const mongoose = require("mongoose");
// const geocoder = require("../utils/geocoder");

const Order = new mongoose.Schema({
  // id: { type: String, required: true, unique: true, sparse: true },

  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    sparse: true
  },

  address: {
    type: String,
    required: [true, "Please Address is Required!"],
    trim: true,
  },

  location: {
    type: { type: String, required: true },
    coordinates: [],
  },

  nearest_landmark: {
    type: String,
    required: [true, "Please Nearest Landmark is Required!"],
    trim: true,
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

  order_details: {
    type: String,
    required: [true, "Please Order Details is Required!"],
    trim: true,
  },
  PaymentStatus: {
    type: String,
    default: "Pending",
  },

  Orderstatus: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//   id: { type: String, required: true, unique: true,sparse: true  },
//   orders: [
//     {
//       rider: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },

//       address: {
//         type: String,
//         required: [true, "Please Address is Required!"],
//         trim: true,
//       },

//       location: {
//         type: { type: String, required: true },
//         coordinates: [],
//       },

//       nearest_landmark: {
//         type: String,
//         required: [true, "Please Nearest Landmark is Required!"],
//         trim: true,
//       },

//       reciever_name: {
//         type: String,
//         required: [true, "Please Name is Required!"],
//         trim: true,
//       },

//       mobile: {
//         type: String,
//         required: [true, "Please Mobile Number is Required!"],
//         trim: true,
//       },

//       order_details: {
//         type: String,
//         required: [true, "Please Order Details is Required!"],
//         trim: true,
//       },
//       PaymentStatus: {
//         type: String,
//         default: "Pending",
//       },

//       Orderstatus: {
//         type: String,
//         default: "Pending",
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
// });

Order.index({ location: "2dsphere" });

// // geocoder create location
// Order.pre("save", async function (next) {
//   const loc = await geocoder.geocode({
//     address: this.address,
//     countryCode: "BH",
//   });
//   console.log(loc);
//   this.location = {
//     type: "Point",
//     coordinates: [loc[0].longitude, loc[0].latitude],
//     formattedAddress: loc[0].formattedAddress,
//   };

//   next();
// });

const orderModel = mongoose.model("Order", Order);

module.exports = { orderModel };
