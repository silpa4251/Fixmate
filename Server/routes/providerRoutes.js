const express = require("express");
const { getNearbyProviders, searchService, getProviderById, availableSlots, getAllProviders } = require("../controller/providerController");
const providerRouter = express.Router();

providerRouter.get("/",getAllProviders);
providerRouter.get("/nearby", getNearbyProviders);
providerRouter.get("/search", searchService);
providerRouter.get("/:id", getProviderById);
providerRouter.get("/slots", availableSlots);

module.exports = providerRouter;
