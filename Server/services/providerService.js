const Provider= require("../models/providerModel");
const Booking = require("../models/bookingModel");
const bcrypt = require("bcryptjs");
// const cloudinary = require("../config/cloudinary");
const { mongoose } = require("mongoose");
const { uploadToS3, generatePresignedUrl } = require("../middlewares/multer");


const getNearbyProvidersService = async (latitude, longitude, distance, service) => {
    const providers = await Provider.find({
      "address.coordinates": {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(distance),
        },
      },
      ...(service && { services: new RegExp(service, "i") }),
    });
    for (let i = 0; i < providers.length; i++) {
      if (providers[i].image) {
        providers[i].image = await generatePresignedUrl(providers[i].image);
      }
      if (providers[i].rating && providers[i].rating.length > 0) {
        const validRatings = providers[i].rating.filter(r => !r.isDeleted);
        const ratingSum = validRatings.reduce((sum, r) => sum + r.rating, 0);
        providers[i]._doc.averageRating = validRatings.length > 0 ? 
          (ratingSum / validRatings.length).toFixed(1) : 0;
        providers[i]._doc.ratingCount = validRatings.length;
      } else {
        providers[i]._doc.averageRating = 0;
        providers[i]._doc.ratingCount = 0;
      }
    }
    console.log("rat", providers)
    return { providers };
};

const searchProviderService = async (service) => {
    const providers = await Provider.find({
      services: new RegExp(service, "i"), // Case-insensitive search
    });
    for (let i = 0; i < providers.length; i++) {
      if (providers[i].image) {
        providers[i].image = await generatePresignedUrl(providers[i].image);
      }
    }
    return { providers }
};

const getAllProvidersService = async (page, limit) => {
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
    for (let i = 0; i < providers.length; i++) {
      if (providers[i].image) {
        providers[i].image = await generatePresignedUrl(providers[i].image);
      }
    }
    const totalProviders = await Provider.countDocuments();
    const totalPages = Math.ceil(totalProviders / limit);
  
    return { providers, totalProviders, totalPages };
};

const getProviderByIdService = async (id) => {
    const provider = await Provider.findById(id);
    const providerData = provider.toObject();
    if (providerData.image) {
      providerData.image = await generatePresignedUrl(providerData.image);
    }
    return { provider: providerData } ;
};

const getBookingByProviderService = async(providerId, page, limit) => {
    const skip = (page - 1) * limit;
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
  const totalPages = Math.ceil(totalBookings / limit);

  return { bookings, totalBookings, totalPages };
}

const createProviderService = async (providerData) => {
  const { name, email, services, password, availability } = providerData;

  if (!name || !email || !services || !password) {
    throw new CustomError(
      "Please provide name, email, services, and password",
      400
    );
  }
  const existingProvider = await Provider.findOne({ email });
  if (existingProvider) {
    throw new CustomError("Provider with this email already exists", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newProvider = await Provider.create({
    name,
    email,
    services,
    password: hashedPassword,
    availability,
  });
  newProvider.password = undefined;

  return newProvider;
};

const updateProviderService = async (providerId, updateData) => {
    const { name, email, services, address, availability, password } = updateData;
  
    // Prepare the update object
    const updatedFields = { name, email, services, address, availability };
  
    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }
  
    // Check if email is being changed and if it's already taken
    if (email) {
      const existingProvider = await Provider.findOne({
        email,
        _id: { $ne: providerId }, // Exclude current provider
      });
  
      if (existingProvider) {
        throw new CustomError("Email already in use", 400);
      }
    }
  
    // Update provider
    const provider = await Provider.findByIdAndUpdate(providerId, updatedFields, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude password from the response
  
    if (!provider) {
      throw new CustomError("No provider found with that ID", 404);
    }
  
    return provider;
};

const blockProviderService = async (providerId) => {
    const provider = await Provider.findById(providerId);
    if (!provider) {
      throw new CustomError("Provider not found", 404);
    }
  
    if (provider.isBlocked) {
      throw new CustomError("Provider is already blocked", 400);
    }
  
    provider.isBlocked = true;
    await provider.save();
  
    return provider;
};

const unblockProviderService = async (providerId) => {
    const provider = await Provider.findById(providerId);
    if (!provider) {
      throw new CustomError("Provider not found", 404);
    }
  
    if (!provider.isBlocked) {
      throw new CustomError("Provider is not blocked", 400);
    }
  
    provider.isBlocked = false;
    await provider.save();
  
    return provider;
};

const getProviderProfileService = async (providerId) => {
    const provider = await Provider.findById(providerId);
    if (!provider) {
      throw new CustomError("Provider not found", 404);
    }
    const providerData = provider.toObject();
    if (providerData.image) {
      providerData.image = await generatePresignedUrl(providerData.image);
    }
    if (providerData.certificates && Array.isArray(providerData.certificates)) {
      for (let i = 0; i < providerData.certificates.length; i++) {
        if (typeof providerData.certificates[i] === 'string') {
          providerData.certificates[i] = await generatePresignedUrl(providerData.certificates[i]);
        } else if (providerData.certificates[i] && typeof providerData.certificates[i].url === 'string') {
          providerData.certificates[i].url = await generatePresignedUrl(providerData.certificates[i].url);
        }
      }
    }
    return providerData;
};
  
const updateProviderProfileService = async (providerId, updateData) => {
    const { name, email, phone, address, charge, services, image, certifications } = updateData;
  console.log("poi", image)
    const updatedProfile = await Provider.findByIdAndUpdate(
      providerId,
      { name, email, phone, address, charge, services, image, certifications },
      { new: true, runValidators: true }
    );
    console.log("poi", updatedProfile)
  
    if (!updatedProfile) {
      throw new CustomError("Profile not found", 404);
    }
  
    return updatedProfile;
};

const uploadProfileImageService = async (file) => {
    if (!file) {
      throw new CustomError("No file uploaded", 400);
    }
  
    const fileUrl = await uploadToS3(file);
    return fileUrl;
};

const uploadCertificateService = async (file) => {
    if (!file) {
      throw new CustomError("No file uploaded", 400);
    }
  
    const fileUrl = await uploadToS3(file);
  
    return fileUrl;
};

const getTodaysBookingsService = async(providerId) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const todaysBookings = await Booking.find({
    providerId: new mongoose.Types.ObjectId(providerId),
    startDate: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ bookingDate: -1 })
  .populate("userId", "name phone"); 

  return todaysBookings;
}
  
const getProviderStatsService = async (providerId) => {
    const totalBookings = await Booking.countDocuments({ providerId });
  
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
    const totalBookingsForToday = await Booking.countDocuments({
      providerId,
      status: "confirmed",
      startDate: { $gte: startOfDay, $lte: endOfDay },
    });
  
    const pendingBookings = await Booking.countDocuments({
      providerId,
      status: "confirmed",
    });
  
    const completedBookings = await Booking.countDocuments({
      providerId,
      status: "completed",
    });
  
    const cancelledBookings = await Booking.countDocuments({
      providerId,
      status: "cancelled",
    });
  
    const provider = await Provider.findById(providerId);
    if (!provider) {
      throw new CustomError("Provider not found", 404);
    }
  
    const chargePerDay = provider.charge;
  
    // Calculate total earnings
    const completeBookings = await Booking.find({
      providerId,
      status: "completed",
    });
  
    const totalEarnings = completeBookings.reduce(
      (total, booking) => total + booking.numberOfDays * chargePerDay,
      0
    );
  
    return {
      totalBookingsForToday,
      completedBookings,
      totalBookings,
      totalEarnings,
      pendingBookings,
      cancelledBookings,
    };
};

const getBookingsByMonthService = async (providerId) => {
  const currentYear = new Date().getFullYear();
  const bookings = await Booking.aggregate([
    {
      $match: {
        providerId: new mongoose.Types.ObjectId(providerId),
        $expr: { $eq: [{ $year: "$startDate" }, currentYear] },
      },
    },
    {
      $group: {
        _id: { $month: "$startDate" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  const monthsInYear = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ].map((month, index) => ({
    month,
    count: 0,
  }));

  bookings.forEach((booking) => {
    monthsInYear[booking._id - 1].count = booking.count;
  });

  return monthsInYear ;
}

const getEarningsByMonthService = async(providerId) => {
  const currentYear = new Date().getFullYear();
  const earnings = await Booking.aggregate([
    {
      $match: {
        providerId: new mongoose.Types.ObjectId(providerId),
        status: "completed",
        $expr: { $eq: [{ $year: "$startDate" }, currentYear] },
      },
    },
    {
      $group: {
        _id: { $month: "$startDate" },
        totalEarnings: { $sum: "$amount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  const monthsInYear = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ].map((month, index) => ({
    month,
    totalEarnings: 0,
  }));

  earnings.forEach((earning) => {
    monthsInYear[earning._id - 1].totalEarnings = earning.totalEarnings;
  });

  return monthsInYear;
}


module.exports = { getNearbyProvidersService, searchProviderService, getAllProvidersService, getProviderByIdService, getBookingByProviderService, createProviderService, updateProviderService, blockProviderService, unblockProviderService, getProviderProfileService, updateProviderProfileService, uploadProfileImageService, uploadCertificateService, getTodaysBookingsService, getProviderStatsService, getBookingsByMonthService, getEarningsByMonthService };