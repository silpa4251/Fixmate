const Provider= require("../models/providerModel");
const Booking = require("../models/bookingModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");


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

    return { providers };
};

const searchProviderService = async (service) => {
    const providers = await Provider.find({
      services: new RegExp(service, "i"), // Case-insensitive search
    });
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
  
    const totalProviders = await Provider.countDocuments();
    const totalPages = Math.ceil(totalProviders / limit);
  
    return { providers, totalProviders, totalPages };
};

const getProviderByIdService = async (id) => {
    const provider = await Provider.findById(id);
    return { provider } ;
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
    return provider;
};
  
const updateProviderProfileService = async (providerId, updateData) => {
    const { name, email, phone, address, charge, services, image, certifications } = updateData;
  
    const updatedProfile = await Provider.findByIdAndUpdate(
      providerId,
      { name, email, phone, address, charge, services, image, certifications },
      { new: true, runValidators: true }
    );
  
    if (!updatedProfile) {
      throw new CustomError("Profile not found", 404);
    }
  
    return updatedProfile;
};

const uploadProfileImageService = async (file) => {
    if (!file) {
      throw new CustomError("No file uploaded", 400);
    }
  
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "profile_images",
      resource_type: "image",
    });
  
    return result.secure_url;
};

const uploadCertificateService = async (file) => {
    if (!file) {
      throw new CustomError("No file uploaded", 400);
    }
  
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "certificates",
      resource_type: "raw",
    });
  
    return result.secure_url;
};
  
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


module.exports = { getNearbyProvidersService, searchProviderService, getAllProvidersService, getProviderByIdService, getBookingByProviderService, createProviderService, updateProviderService, blockProviderService, unblockProviderService, getProviderProfileService, updateProviderProfileService, uploadProfileImageService, uploadCertificateService, getProviderStatsService };