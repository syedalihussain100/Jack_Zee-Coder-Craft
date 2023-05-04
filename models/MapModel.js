const mongoose = require("mongoose");
const {Schema} = mongoose;

// location api create




const locationSchema  = new Schema({
    name:String,
    latitude: Number,
    longitude: Number
})




const Location = mongoose.model("Location",locationSchema);




module.exports = {Location};


