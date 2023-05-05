const axios = require("axios");
const { Location } = require("../models/MapModel");
const GOOGLE_MAPS_API_KEY = 'AIzaSyAoSbver7G9emTgsZMM4RCAXt3z5pjauYE'; // Replace with your own Google Maps API key



const mapLocation = async (req, res) => {
  try {
    const { pickupAddress, dropoffAddress } = req.query;

    // Make requests to the Geocoding API to get the longitude and latitude of the pickup and dropoff addresses
    const pickupResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${pickupAddress}&key=AIzaSyAoSbver7G9emTgsZMM4RCAXt3z5pjauYE`
    );
    const dropoffResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${dropoffAddress}&key=AIzaSyAoSbver7G9emTgsZMM4RCAXt3z5pjauYE`
    );

    // Extract the longitude and latitude from the response
    const pickupLocation = pickupResponse.data.results[0].geometry.location;
    const dropoffLocation = dropoffResponse.data.results[0].geometry.location;

    // Store the pickup and dropoff locations in the database
    let pickup = await Location.create({
      name: "pickup",
      latitude: pickupLocation.lat,
      longitude: pickupLocation.lng,
    });
    let dropoff = await Location.create({
      name: "dropoff",
      latitude: dropoffLocation.lat,
      longitude: dropoffLocation.lng,
    });

    res.status(200).send({
      message: "Locations stored in the database",
      pickup,
      dropoff,
    });
  } catch (error) {
    res.status(500).send(error?.message);
  }
};







// second modeule get time heree 

const getTime =  async (req, res) => {
  const { pickup, dropoff } = req.query;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${pickup}&destinations=${dropoff}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const duration = response.data.rows[0].elements[0].duration.text;

    res.status(200).json({ duration });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = { mapLocation,getTime};
