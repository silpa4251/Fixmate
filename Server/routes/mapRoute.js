const express = require("express");
const { fetchGeoCoordinates, reverseGeocode } = require("../controller/mapController");
const mapRouter = express.Router();

mapRouter.get("/geocode", fetchGeoCoordinates);
mapRouter.get("/reverse", reverseGeocode);

module.exports = mapRouter;