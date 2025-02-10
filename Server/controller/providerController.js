const Booking = require("../models/bookingModel");
const Provider= require("../models/providerModel");
const bcrypt = require("bcryptjs");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");

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

const getBookingByProvider = asyncErrorHandler(async (req, res) => {
  const providerId = req.params.id;
  
  // Verify provider exists
  const provider = await Provider.findById(providerId);
  if (!provider) {
    throw new CustomError('Provider not found', 404);
  }
  const bookings = await Booking.find({ providerId: providerId })
  .populate('userId', 'name address')
  .sort({ date: 1, slot: 1 });

  res.status(200).json({
    status: "success",
    message: "Bookings fetched successfully",
    bookings
  });
});

const createProvider = asyncErrorHandler(async (req, res) => {
  // Validate required fields
  console.log("gt",req.body)
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.services ||
    !req.body.password
  ) {
    throw new CustomError('Please provide name, email, services, address, password, and password confirmation', 400);
  }

  // for (const addr of req.body.address) {
  //   if (
  //     !addr.place ||
  //     !addr.district ||
  //     !addr.state ||
  //     !addr.pincode ||
  //     !addr.coordinates ||
  //     !Array.isArray(addr.coordinates.coordinates) || // Ensure coordinates are an array
  //     addr.coordinates.coordinates.length !== 2       // Ensure exactly two coordinates (longitude, latitude)
  //   ) {
  //     throw new CustomError('Invalid address format. Each address must include place, district, state, pincode, and valid coordinates.', 400);
  //   }
  // }

  // Check if provider with email already exists
  const existingProvider = await Provider.findOne({ email: req.body.email });
  if (existingProvider) {
    throw new CustomError('Provider with this email already exists', 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create new provider
  const newProvider = await Provider.create({
    name: req.body.name,
    email: req.body.email,
    services: req.body.services,
    // address: req.body.address,
    password: hashedPassword,
  });

  // Remove password from response
  newProvider.password = undefined;

  res.status(201).json({
    status: 'success',
    provider: newProvider,
  });
});


const updateProvider = asyncErrorHandler(async (req, res) => {
  const updateData = {
    name: req.body.name,
    email: req.body.email,
    services: req.body.services,
    address: req.body.address,
  };

  // If password is provided, hash it
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(req.body.password, salt);
  }

  // Check if email is being changed and if it's already taken
  if (req.body.email) {
    const existingProvider = await Provider.findOne({
      email: req.body.email,
      _id: { $ne: req.params.id }, // Exclude current provider
    });

    if (existingProvider) {
      throw new CustomError('Email already in use', 400);
    }
  }

  // Update provider
  const provider = await Provider.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).select('-password'); // Exclude password from the response

  if (!provider) {
    throw new CustomError('No provider found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    provider,
  });
});

const blockProvider = asyncErrorHandler(async (req, res) => {
  const providerId = req.params.id;
  const provider = await Provider.findById(providerId);
  console.log("id", provider);
  if (!provider) {
    throw new CustomError("provider not found", 404);
  }

 
  if (provider.isBlocked) {
    throw new CustomError("provider is already blocked", 400);
  }

  provider.isBlocked = true;
  await provider.save();

  res.status(200).json({
    status: 'success',
    message:"provider blocked successfully",
    provider
  });
});

const unblockProvider = asyncErrorHandler(async (req, res) => {
  const providerId = req.params.id;

  const provider = await Provider.findById(providerId);
  if (!provider) {
    throw new CustomError("provider not found", 404);
  }

  if (!provider.isBlocked) {
    throw new CustomError("provider is not blocked", 400);
  }

  provider.isBlocked = false;
  await provider.save();

  res.status(200).json({status: "success",message:"provider unblocked successfully", provider});
});

module.exports = { getNearbyProviders, searchService,getAllProviders, getProviderById, getBookingByProvider, createProvider, updateProvider, blockProvider, unblockProvider };
