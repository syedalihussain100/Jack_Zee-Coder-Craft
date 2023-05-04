const axios = require("axios");
const { Location } = require("../models/MapModel");

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
    await Location.create({
      name: "pickup",
      latitude: pickupLocation.lat,
      longitude: pickupLocation.lng,
    });
    await Location.create({
      name: "dropoff",
      latitude: dropoffLocation.lat,
      longitude: dropoffLocation.lng,
    });

    res.status(200).send("Locations stored in the database");
  } catch (error) {
    res.status(500).send(error?.message);
  }
};

module.exports = { mapLocation };
