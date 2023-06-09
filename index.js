require("dotenv").config({ path: "config/config.env" });
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const cloudniary = require("cloudinary");
const cookieParser = require("cookie-parser");
const path = require("path");


// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use("*", cors());
app.use(cookieParser());



cloudniary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.API_Key,
  api_secret: process.env.API_Secret
})

// routes

const user_Route = require("./routes/userRoute");
const order_Route = require("./routes/orderRoute");
const wallet_Route = require("./routes/walletRoute");
const payment = require("./routes/paymentRoute");
const map = require("./routes/mapRoute");

app.use(`/api`, user_Route);
app.use(`/api`,order_Route);
app.use(`/api`,wallet_Route);
app.use(`/api`,payment);
app.use(`/api`,map);


app.use(express.static(path.join(__dirname,"./client/build")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
});


app.get(`/`,(req,res)=>{
  res.status(200).send("Hello Jack Delivery");
})

app.use("*",(req,res,next)=>{
  res.status(400).send("Page Not Found!");
  next()
})


// database connect

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Database Connected");
});

// server running

app.listen(process.env.PORT, () => {
  console.log(`Your Server is Running on this! ${PORT}`);
});
