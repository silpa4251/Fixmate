const Booking = require("../models/bookingModel");
const Provider= require("../models/providerModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const getNearbyProviders = asyncErrorHandler(async (req, res) => {
  const { latitude, longitude, distance = 5000, service } = req.query;

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
      ...(service  && {services: new RegExp(service,"i")}),
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

const getAllProviders = asyncErrorHandler(async (req, res) => {
  const providers = await Provider.aggregate([
    {
      $project: {
          name: 1,
          email: 1,
          services: 1,
          address: 1,
          createdAt: 1,
        }
    }
]);
  res.status(200).json({message:"All users retrieved successfully", providers});
});

const getProviderById = asyncErrorHandler( async(req, res) => {
  const providerId = req.params.id;
  const provider = await Provider.findById(providerId);
  if(!provider) {
    throw new CustomError("provider not found", 404);
  }
  res.status(200).json({status: "success", message:"provider retrieved successfully", provider})
});



module.exports = { getNearbyProviders, searchService,getAllProviders, getProviderById };
