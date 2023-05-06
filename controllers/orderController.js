const { orderModel } = require("../models/OrderModel");

// create order

const orderCreate = async (req, res) => {
  try {
    if (
      !req.body.rider ||
      !req.body.address ||
      !req.body.nearest_landmark ||
      !req.body.reciever_name ||
      !req.body.ammount ||
      !req.body.mobile ||
      !req.body.order_details ||
      !req.body.latitude ||
      !req.body.longitude
    ) {
      res.status(200).send({ success: false, msg: "All fields are required!" });
    } else {
      const store = new orderModel({
        rider: req.body.rider,
        address: req.body.address,
        nearest_landmark: req.body.nearest_landmark,
        reciever_name: req.body.reciever_name,
        ammount:req.body.ammount,
        mobile: req.body.mobile,
        order_details: req.body.order_details,
        PaymentStatus: req.body.PaymentStatus,
        location: {
          type: "Point",
          coordinates: [
            parseFloat(req.body.longitude),
            parseFloat(req.body.latitude),
          ],
        },
      });

      // let alreadyId = await userModel.findOne({ id });

      // if (alreadyId) {
      //   return res
      //     .status(400)
      //     .json({
      //       success: false,
      //       message: `Order ${req.body.id} already exists`,
      //     });
      // }

      const storeData = await store.save();
      res
        .status(200)
        .send({ success: true, msg: "Order is Created.", data: storeData });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};



// get order
const orderGet = async (req, res) => {
  try {
    const stores = await orderModel.find().populate("rider");

    return res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

// // find details order

const orderDetails = async (req, res) => {
  try {
    // const { id } = req.params;
    // const orderDetail = await orderModel
    //   .findById(id)
    //   .populate("rider", ["-password", "-token"]);
    const { reciever_name } = req.body;

    const finedata = await orderModel
      .findOne({ reciever_name })
      .populate("rider", ["-password", "-token"]);

    if (!finedata) {
      return res.status(400).send("Something Error");
    }

    res.status(200).send(finedata);
  } catch (error) {
    res.status(500).send(error?.message);
  }
};

const orderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const newuserData = {
      Orderstatus: req.body.Orderstatus,
    };
    const orderStatus = await orderModel.findByIdAndUpdate(id, newuserData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Your Order Status has been Updated",
      orderStatus,
    });
  } catch (error) {
    res.status(500).send(error?.message);
  }
};

module.exports = { orderCreate, orderGet, orderDetails, orderStatus };

// location: {
//   type: "Point",
//   coordinates: [
//     parseFloat(req.body.longitude),
//     parseFloat(req.body.latitude),
//   ],
// },
