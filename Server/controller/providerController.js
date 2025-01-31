const Provider = require("../models/providerModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const getNearbyProviders = asyncErrorHandler(async (req, res) => {
  const { latitude, longitude, distance, service } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }
    const providers = await Provider.find({
      "address.coordinates": {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(distance),
        },
      },
      ...(service  && {service: new RegExp(service,"i")}),
    });

    res.status(200).json({ providers });

});

const searchService = asyncErrorHandler(async (req, res) => {
  const { service } = req.query;

  if (!service) {
    return res.status(400).json({ message: "Service name is required" });
  }

  // Find providers by service name (case-insensitive)
  const providers = await Provider.find({
    services: new RegExp(service, "i"),
  });

  res.status(200).json({ providers });
});

module.exports = { getNearbyProviders, searchService };
