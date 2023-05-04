const express = require("express");
const map_Route = express.Router();
const bodyParser = require("body-parser");
const { mapLocation } = require("../controllers/mapController");



map_Route.use(express.json());
map_Route.use(bodyParser.json());
map_Route.use(bodyParser.urlencoded({ extended: true }));



map_Route.get(`/locations`,mapLocation);





module.exports = map_Route;

