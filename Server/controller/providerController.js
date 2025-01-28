const Provider = require("../models/providerModel");

const getNearbyProviders = async (req, res) => {
  const { latitude, longitude, distance = 5000 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    const providers = await Provider.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(distance),
        },
      },
    });

    res.json({ providers });
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ message: "Error fetching nearby providers" });
  }
};

module.exports = { getNearbyProviders };
