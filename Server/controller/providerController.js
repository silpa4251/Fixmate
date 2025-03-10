const { RESPONSE } = require("../constants/response");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const { getNearbyProvidersService, searchProviderService, getAllProvidersService, getProviderByIdService, getBookingByProviderService, createProviderService, updateProviderService, blockProviderService, unblockProviderService, getProviderProfileService, updateProviderProfileService, uploadProfileImageService, uploadCertificateService, getProviderStatsService, getBookingsByMonthService, getEarningsByMonthService, getTodaysBookingsService } = require("../services/providerService");

const getNearbyProviders = asyncErrorHandler(async (req, res) => {
  const { latitude, longitude, distance = 5000, service } = req.query;

  if (!latitude || !longitude) {
   throw new CustomError("Latitude and longitude are required", 400);
  }

  const {providers} = await getNearbyProvidersService(latitude, longitude, distance, service);

  res.status(200).json({ status: RESPONSE.success, message: "providers fetched successfully", providers });
});

const searchProvider = asyncErrorHandler(async (req, res) => {
  const { service } = req.query;

  if (!service) {
    throw new CustomError("Service name is required", 400);
  }

  const {providers} = await searchProviderService(service);

  res.status(200).json({status: RESPONSE.success, message:"Search is successfull", providers });
});

const getAllProviders = asyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const { providers, totalProviders, totalPages } = await getAllProvidersService(page, limit);

  res.status(200).json({status: RESPONSE.success, message:"All providers retrieved successfully", providers, pagination: {
    currentPage: page,
    totalPages,
    totalProviders,
    limit,
  },});
});

const getProviderById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const {provider} = await getProviderByIdService(id);

  if (!provider) {
    throw new CustomError("Provider not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Provider retrieved successfully",
    provider,
  });
});

const getBookingByProvider = asyncErrorHandler(async (req, res) => {
  const providerId = req.params.id;
   const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { bookings, totalBookings, totalPages } = await getBookingByProviderService(providerId, page, limit);
  res.status(200).json({
    status: RESPONSE.success,
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
  const newProvider = await createProviderService(req.body);

  res.status(201).json({
    status: 'success',
    provider: newProvider,
  });
});

const updateProvider = asyncErrorHandler(async (req, res) => {
  const providerId = req.params.id;
  const updatedProvider = await updateProviderService(providerId, req.body);

  res.status(200).json({
    status: "success",
    provider: updatedProvider,
  });
});

const blockProvider = asyncErrorHandler(async (req, res) => {
  const providerId = req.params.id;
  const blockedProvider = await blockProviderService(providerId);

  res.status(200).json({
    status: "success",
    message: "Provider blocked successfully",
    provider: blockedProvider,
  });
});

const unblockProvider = asyncErrorHandler(async (req, res) => {
  const providerId = req.params.id;
  const unblockedProvider = await unblockProviderService(providerId);

  res.status(200).json({
    status: "success",
    message: "Provider unblocked successfully",
    provider: unblockedProvider,
  });
});

const getProviderProfile = asyncErrorHandler(async (req, res) => {
  const provider = await getProviderProfileService(req.user.id);

  res.status(200).json({
    status: "success",
    message: "Profile fetched successfully",
    provider,
  });
});

const updateProfile = asyncErrorHandler(async (req, res) => {
  const updatedProfile = await updateProviderProfileService(req.user.id, req.body);

  res.status(200).json({
    status: "success",
    profile: updatedProfile,
  });
});

const uploadProfilePicture = asyncErrorHandler(async (req, res) => {
  const profileImageUrl = await uploadProfileImageService(req.file);

  res.status(200).json({
    status: "success",
    image: profileImageUrl,
  });
});

const uploadCertificate = asyncErrorHandler(async (req, res) => {
  const certificateUrl = await uploadCertificateService(req.file);

  res.status(200).json({
    success: true,
    certificateUrl,
  });
});

const getTodaysBookings = asyncErrorHandler( async( req, res) => {
  const providerId = req.user.id;
  const data = await getTodaysBookingsService(providerId);
  res.status(200).json({
    status: "success",
    data
  });
})

const getProviderStats = asyncErrorHandler(async (req, res) => {
  const providerId = req.user.id;
  const stats = await getProviderStatsService(providerId);

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

const getBookingsByMonth = asyncErrorHandler( async(req, res) => {
  const providerId = req.user.id;
  const data = await getBookingsByMonthService(providerId);
  res.status(200).json({
    status: "success",
    data
  });

})

const getEarningsByMonth = asyncErrorHandler( async(req, res) => {
  const providerId = req.user.id;
  const data = await getEarningsByMonthService(providerId);
  res.status(200).json({
    status: "success",
    data
  });

})

module.exports = { getNearbyProviders, searchProvider, getAllProviders, getProviderById, getBookingByProvider, createProvider, updateProvider, blockProvider, unblockProvider, getProviderProfile, updateProfile,  uploadProfilePicture, uploadCertificate, getTodaysBookings, getProviderStats, getBookingsByMonth, getEarningsByMonth };
