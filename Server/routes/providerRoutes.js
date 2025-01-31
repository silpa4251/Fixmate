const express = require("express");
const { getNearbyProviders, searchService } = require("../controller/providerController");
const providerRouter = express.Router();

providerRouter.get("/nearby", getNearbyProviders);
providerRouter.get("/search", searchService);

module.exports = providerRouter;
