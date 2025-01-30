const express = require("express");
const { fetchGeoCoordinates } = require("../controller/mapController");
const mapRouter = express.Router();

mapRouter.get("/", fetchGeoCoordinates);

module.exports = mapRouter;