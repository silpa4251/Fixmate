const { RESPONSE } = require("../constants/response");
const { newBookingService, getProviderBookedDatesService, getUserBookingsService, checkAvailabilityService, getAllBookingsService, getProviderBookingsService, getBookingByIdService, rescheduleBookingService, updateBookingStatusService, createBookingService, editBookingService, deleteBookingService } = require("../services/bookingService");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");

// Create a new booking
const newBooking = asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const booking = await newBookingService(userId, req.body); 
  res
    .status(201)
    .json({ status: RESPONSE.success, message: "Booking successful!", booking});
});

const getProviderBookedDates = asyncErrorHandler(async (req, res) => {
  const { providerId } = req.params;
  
  const bookedDates = await getProviderBookedDatesService(providerId);

  res.status(200).json({
    status: RESPONSE.success,
    message: "Booked Dates retrived successfully",
    bookedDates,
  });
});

const checkAvailability = asyncErrorHandler(async (req, res) => {
  const { providerId, startDate, endDate } = req.query;

  if (!providerId || !startDate || !endDate) {
    throw new CustomError("Missing required parameters (providerId, startDate, endDate)",400);
  }

  const isAvailable = await checkAvailabilityService(providerId, startDate, endDate);

  res.status(200).json({
    status: RESPONSE.success,
    message: "successfull",
    isAvailable,
  });
});

const getAllBookings = asyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { bookings, totalBookings, totalPages } = await getAllBookingsService(page, limit);

  res.status(200).json({
    status: RESPONSE.success,
    message: "All bookings retrieved successfully",
    bookings,
    pagination: {
      currentPage: page,
      totalPages,
      totalBookings,
      limit,
    },
  });
});


// Get user bookings
const getUserBookings = asyncErrorHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new CustomError("User ID missing", 400);
  }
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10;
  const { bookings, pagination } = await getUserBookingsService(req.user.id, page, limit);
  res.status(200).json({
    status: RESPONSE.success,
    message: "Bookings fetched successfully",
    bookings,
    pagination
  });
});

// Get provider bookings
const getProviderBookings = asyncErrorHandler(async (req, res) => {
  const providerId = req.user.id;
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10;
  const { formattedBookings, totalBookings, totalPages } =
    await getProviderBookingsService(providerId, page, limit);

  res.status(200).json({
    status: RESPONSE.success,
    message: "Bookings fetched successfully",
    bookings: formattedBookings,
    pagination: {
      currentPage: page,
      totalPages,
      totalBookings,
      limit,
    },
  });
});

const bookingById = asyncErrorHandler(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await getBookingByIdService(bookingId);

  res.status(200).json({
    status: RESPONSE.success,
    message: "Booking details fetched successfully.",
    booking,
  });
});

const rescheduleBookings = asyncErrorHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;
  const updatedBooking = await rescheduleBookingService(bookingId, startDate, endDate);

  res.status(200).json({
    status: RESPONSE.success,
    message: "Booking rescheduled successfully.",
    booking: updatedBooking,
  });
});

// Update booking status
const updateBookingStatus = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updatedBooking = await updateBookingStatusService(id, status);

  res.status(200).json({
    status: RESPONSE.success,
    message: "Booking status updated successfully.",
    booking: updatedBooking,
  });
});

const createBooking = asyncErrorHandler(async (req, res) => {
  const { user, provider, startDate, endDate, status = 'pending'} = req.body;
  const booking = await createBookingService(user, provider, startDate, endDate, status);
  res.status(201).json({
    status: RESPONSE.success,
    message: 'Booking created successfully',
    booking
  });
})

const editBooking = asyncErrorHandler(async(req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate, status } = req.body;

  const updatedBooking = await editBookingService(bookingId, startDate, endDate, status);

  res.status(200).json({
    status: RESPONSE.success,
    message: "Booking updated successfully.",
    booking: updatedBooking,
  });
})

const deleteBooking = asyncErrorHandler(async (req, res) => {
    const { bookingId } = req.params;
    const result = await deleteBookingService(bookingId);

    res.status(200).json({
      status: RESPONSE.success,
      message: result.message,
    });
});

module.exports = {
  newBooking,
  getProviderBookedDates,
  checkAvailability,
  getAllBookings,
  getUserBookings,
  getProviderBookings,
  bookingById,
  rescheduleBookings,
  updateBookingStatus,
  createBooking,
  editBooking,
  deleteBooking
};
