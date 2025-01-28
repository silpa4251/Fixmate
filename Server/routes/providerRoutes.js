const express = require("express");
const { getNearbyProviders } = require("../controller/providerController");
const providerRouter = express.Router();

providerRouter.get("/nearby", getNearbyProviders);

module.exports = providerRouter;
