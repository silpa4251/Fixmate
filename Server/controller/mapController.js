const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const { geoCodingApi, reverseApi } = require("../utils/geoCodingApi");


const fetchGeoCoordinates = asyncErrorHandler( async(req,res) => {
    const { address } = req.query;
    if (!address) {
        throw new CustomError("Address is required",400);
    }
    const { lat, lng } = await geoCodingApi(address);
    return res.json({lat, lng});
})


const reverseGeocode = asyncErrorHandler(async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    throw new CustomError("Latitude and longitude are required",400);
  }
  const address = await reverseApi(lat,lng);
  return res.json({ address });
   
});



module.exports = { fetchGeoCoordinates, reverseGeocode };