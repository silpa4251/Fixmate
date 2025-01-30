const axios = require("axios");
const CustomError = require("./customError");

const geoCodingApi = async (address) => {
  try {
    if (!address) {
        throw new CustomError("Address is required");
      }
    let query = "";

    if (typeof address === "string") {
        query = address; // Handle single string (e.g., "New York")
    } else if (address.place) {
        query = [address.place, address.district, address.state, address.pincode]
          .filter(Boolean) // Removes undefined/null values
          .join(", ");
    } else {
        throw new CustomError("Invalid address format. Please provide at least a place name.");
    }
  
      console.log("Geocoding Query:", query);
    const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {
        q: query,
        key: process.env.GEO_API_KEY,
      },
    });

    if (response.data && response.data.results && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        return { lat, lng }; // Return the coordinates
      } else {
        throw new CustomError("Location not found");
      }
  } catch (error) {
    console.error("Geolocation API Error:", error.message);
    throw new CustomError("Failed to fetch geolocation data. Please try again.", 500);
  }
};

const reverseApi = async(lat,lng) => {
    if (!lat || !lng) {
        throw new CustomError("Latitude and longitude are required",400);
    }
    const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
          key: process.env.GEO_API_KEY,
          q: `${lat},${lng}`,
        },
      });
  
      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted;
        return res.json({ address });
      } else {
        return res.status(404).json({ message: "No address found for the given coordinates." });
    }
}
module.exports = { geoCodingApi, reverseApi };