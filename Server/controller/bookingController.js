const Booking = require("../models/bookingModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
// const { generateSlots, parseTime } = require("../utils/generateSlots");

// Create a new booking
const newBooking = asyncErrorHandler(async (req, res) => {
  const { providerId, startDate, endDate, numberOfDays } = req.body;
  const userId = req.user.id;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlappingBookings = await Booking.find({
    providerId,
    $or: [
      {
        startDate: { $lte: end },
        endDate: { $gte: start },
      },
      {
        startDate: { $lte: end },
        endDate: { $gte: start },
      },
    ],
  });

  if (overlappingBookings.length > 0) {
    throw new CustomError("Selected dates are not available", 400);
  }

  const booking = await Booking.create({
    userId,
    providerId,
    startDate,
    endDate,
    numberOfDays,
    status: "pending",
  });

  res
    .status(201)
    .json({ status: "success", message: "Booking successful!", booking });
});

const getProviderBookedDates = asyncErrorHandler(async (req, res, next) => {
  const { providerId } = req.params;
  
  const bookings = await Booking.find({
    providerId,
    status: "confirmed", 
}).select("startDate endDate");
  
  const bookedDates = [];
  bookings.forEach((booking) => {
    const currentDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    while (currentDate <= endDate) {
      bookedDates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  res.status(200).json({
    status: "success",
    bookedDates,
  });
});

const checkAvailability = asyncErrorHandler(async (req, res, next) => {
  const { providerId, startDate, endDate } = req.query;

  // Convert dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Find any overlapping bookings
  const overlappingBookings = await Booking.find({
    provider: providerId,
    status: "confirmed",
    $or: [
      // Booking starts during the requested period
      {
        startDate: { $lte: end },
        endDate: { $gte: start },
      },
      // Booking ends during the requested period
      {
        startDate: { $lte: end },
        endDate: { $gte: start },
      },
    ],
  });

  const isAvailable = overlappingBookings.length === 0;

  res.status(200).json({
    status: "success",
    isAvailable,
  });
});

const getAllBookings = asyncErrorHandler(async (req, res) => {
  const bookings = await Booking.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "providers",
        localField: "providerId",
        foreignField: "_id",
        as: "provider",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $unwind: "$provider",
    },
    {
      $project: {
        date: 1,
        slot: 1,
        status: 1,
        user: {
          name: 1,
        },
        provider: {
          name: 1,
          services: 1,
        },
      },
    },
  ]);
  res
    .status(200)
    .json({ message: "All bookings retrieved successfully", bookings });
});

// Get user bookings
const getUserBookings = asyncErrorHandler(async (req, res) => {
  if (!req.user?.id) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID missing" });
  }
  const bookings = await Booking.find({ userId: req.user.id })
    .populate("providerId", "name image address services charge status")
    .sort({ date: 1 });
  res.status(200).json({
    status: "success",
    message: "Bookings fetched successfully",
    bookings,
  });
});

// Get provider bookings
const getProviderBookings = asyncErrorHandler(async (req, res) => {
  const providerId = req.params.id;

  const bookings = await Booking.find({ providerId })
    .populate("userId", "name email")
    .populate("serviceId", "name price")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: "Bookings fetched successfully",
    bookings,
  });
});

const bookingById = asyncErrorHandler(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId)
    .populate("providerId", "name image address services charge")
    .populate("userId", "name phone address");
  console.log("id", booking);
  if (!booking) {
    throw new CustomError("Booking not found.", 404);
  }
  res.status(200).json({
    status: "success",
    message: "Booking details fetched successfully.",
    booking,
  });
});

const rescheduleBookings = asyncErrorHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { newDate, newSlot } = req.body;

  // Fetch the booking to validate its status
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({
      status: "error",
      message: "Booking not found.",
    });
  }

  // Check if the booking is already completed or canceled
  if (booking.status === "completed") {
    return res.status(400).json({
      status: "error",
      message: "Cannot reschedule a completed booking.",
    });
  }
  if (booking.status === "cancelled") {
    return res.status(400).json({
      status: "error",
      message: "Cannot reschedule a canceled booking.",
    });
  }

  // Check if the new slot is already booked
  const existingBooking = await Booking.findOne({
    providerId: booking.providerId,
    date: newDate,
    slot: newSlot,
  });

  if (existingBooking && existingBooking._id.toString() !== bookingId) {
    return res.status(400).json({
      status: "error",
      message: "This slot is already booked.",
    });
  }

  // Update the booking with the new date and slot
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { date: newDate, slot: newSlot },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Booking rescheduled successfully.",
    booking: updatedBooking,
  });
});

// Update booking status
const updateBookingStatus = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid status value." });
  }

  // Fetch the booking to validate its current status
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new CustomError("Booking not found", 404);
  }

  // Prevent canceling a completed booking
  if (status === "cancelled" && booking.status === "completed") {
    return res.status(400).json({
      status: "error",
      message: "Cannot cancel a completed booking.",
    });
  }

  // Update the booking status
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("userId");

  res.status(200).json({
    status: "success",
    message: "Booking status updated successfully.",
    booking: updatedBooking,
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
};
