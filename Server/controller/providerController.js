const Booking = require("../models/bookingModel");
const Provider= require("../models/providerModel");
const bcrypt = require("bcryptjs");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const cloudinary = require("../config/cloudinary");

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
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const skip = (page - 1) * limit;

  const providers = await Provider.aggregate([
    {
      $project: {
          name: 1,
          email: 1,
          services: 1,
          address: 1,
          image: 1,
          isBlocked: 1,
          status: 1,
          createdAt: 1,
        },
    },
    { $skip: skip }, 
    { $limit: limit },
]);
const totalProviders = await Provider.countDocuments();
const totalPages = Math.ceil(totalProviders / limit);

  res.status(200).json({message:"All providers retrieved successfully", providers, pagination: {
    currentPage: page,
    totalPages,
    totalProviders,
    limit,
  },});
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
   const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  // Verify provider exists
  const provider = await Provider.findById(providerId);
  if (!provider) {
    throw new CustomError('Provider not found', 404);
  }
  const bookings = await Booking.find({ providerId: providerId })
  .populate('userId', 'name address')
  .sort({ date: 1, slot: 1 })
  .skip(skip) 
  .limit(limit);
  const totalBookings = await Booking.countDocuments({ providerId: providerId });

  // Calculate total pages
  const totalPages = Math.ceil(totalBookings / limit);
  res.status(200).json({
    status: "success",
    message: "Bookings fetched successfully",
    bookings,
    pagination: {
      currentPage: page,
      totalPages,
      totalBookings,
      limit,
    },
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
    availability: req.body.availability,
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
    availability: req.body.availability,
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

const getProviderProfile = asyncErrorHandler(async (req, res) => {
  console.log("req",req.user)
    const provider = await Provider.findById(req.user.id);
    if (!provider) {
      throw new CustomError('Provider not found',404);
    }
    res.status(200).json({ status:"success",message: "profile fetched successfully", provider });
});

const updateProfile = asyncErrorHandler(async (req, res) => {
    const { name, email, phone, address, charge, services, image, certifications } = req.body;
    console.log("ki", image)

    const updatedProfile = await Provider.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address, charge, services, image, certifications },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      throw new CustomError('Profile not found', 404);
    }

    return res.status(200).json({ status:"success", profile: updatedProfile });
});

const uploadProfilePicture = asyncErrorHandler(async (req, res) => {
  console.log("fil",req.file);
    const file = req.file;
    if (!file) {
      throw new CustomError('No file uploaded',400);
    }
    console.log("File path:", file.path);
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'profile_images',
      resource_type: 'image',
    });
    const profileImageUrl = result.secure_url;
    console.log('prourl', profileImageUrl)

    return res.status(200).json({ status:"success", image: profileImageUrl});
});

const uploadCertificate = asyncErrorHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'certificates',
      resource_type: 'raw',
    });
    console.log("ju",result.secure_url )
    return res.status(200).json({ success: true, certificateUrl: result.secure_url });
});

  
const getProviderStats = asyncErrorHandler(async (req, res) => {
    const providerId = req.user.id;
    const totalBookings = await Booking.countDocuments({ providerId });
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const totalBookingsForToday = await Booking.countDocuments({ 
      providerId,
      status: 'confirmed',
      startDate: {
        $gte: startOfDay, 
        $lte: endOfDay, 
      },

    });
    const pendingBookings = await Booking.countDocuments({
      providerId,
      status: 'confirmed'
      })
    const completedBookings = await Booking.countDocuments({ 
      providerId,
      status: 'completed'
    });
    const cancelledBookings = await Booking.countDocuments({
      providerId,
      status: 'cancelled'
    })
    // Calculate average rating
    // const ratings = await Rating.find({ providerId });
    // const averageRating = ratings.length > 0
    //   ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
    //   : 0;
    const provider = await Provider.findById(providerId);
  if (!provider) {
    throw new CustomError("Provider not found", 404);
  }
  const chargePerDay = provider.charge;

    // Calculate total revenue
    const completeBookings = await Booking.find({
      providerId,
      status:"completed",
    });
    
    const totalEarnings = completeBookings.reduce((total, booking) => total + booking.numberOfDays * chargePerDay, 0);

    // Get monthly revenue stats
    // const monthlyRevenue = await Booking.aggregate([
    //   {
    //     $match: {
    //       providerId,
    //       status: 'completed',
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         year: { $year: "$startDate" },
    //         month: { $month: "$startDate" },
    //       },
    //       revenue: { 
    //         $sum: {
    //           $multiply: ["$numberOfDays", chargePerDay],
    //         },
    //        }
    //     }
    //   },
    //   { 
    //     $sort: { '_id.year': -1, '_id.month': -1 }
    //   },
    //   {
    //     $project: {
    //       _id: 0, 
    //       year: "$_id.year",
    //       month: "$_id.month",
    //       revenue: 1,
    //     },
    //   },
    // ]);

    return res.status(200).json({
      status:"success",
      data: {
        totalBookingsForToday,
        completedBookings,
        totalBookings,
        totalEarnings,
        pendingBookings,
        cancelledBookings,
      }
    });
  });

  const getTotalEarnings = asyncErrorHandler(async(req, res) => {
    const providerId = req.user.id;

    const bookings = await Booking.find({ providerId })
        .populate("userId", "name email address phone")
        .populate("providerId", "charge");
    
    const formatted = bookings.map((booking) => ({
        _id: booking._id,
        userId: {
          _id: booking.userId._id,
          name: booking.userId.name,
          email: booking.userId.email,
          phone: booking.userId.phone,
          address: booking.userId.address[0],
        },
        providerId: {
          _id: booking.providerId._id,
          services: booking.providerId.services,
        },
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
        earnings: booking.numberofdays * booking.providerId.charge
        }));
        

  })

module.exports = { getNearbyProviders, searchService,getAllProviders, getProviderById, getBookingByProvider, createProvider, updateProvider, blockProvider, unblockProvider, getProviderProfile, updateProfile,  uploadProfilePicture, uploadCertificate, getProviderStats };
