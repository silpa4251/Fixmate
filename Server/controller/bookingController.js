
const { RESPONSE } = require("../constants/response");
const Provider = require("../models/providerModel");
const User = require("../models/userModel");
const { newBookingService } = require("../services/bookingService");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

// const { generateSlots, parseTime } = require("../utils/generateSlots");

// Create a new booking
const newBooking = asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const data = await newBookingService(userId, req.body); 
  res
    .status(201)
    .json({ status: RESPONSE.success, message: "Booking successful!", data});
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
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const bookings = await Booking.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
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
        startDate: 1,
        endDate: 1,
        status: 1,
        user: {
          name: 1,
          email: 1,
        },
        provider: {
          name: 1,
          email: 1,
          services: 1,
        },
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  const totalBookings = await Booking.countDocuments({ isDeleted: false });
  const totalPages = Math.ceil(totalBookings / limit);
  res
    .status(200)
    .json({ message: "All bookings retrieved successfully", bookings, pagination: {
      currentPage: page,
      totalPages,
      totalBookings,
      limit,
    },});
});

// Get user bookings
const getUserBookings = asyncErrorHandler(async (req, res) => {
  if (!req.user?.id) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID missing" });
  }
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const bookings = await Booking.find({ userId: req.user.id })
    .populate("providerId", "name image address services charge status")
    .sort({ date: 1 })
    .skip(skip) 
    .limit(limit); 
    const totalBookings = await Booking.countDocuments({userId: req.user.id  });

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

// Get provider bookings
const getProviderBookings = asyncErrorHandler(async (req, res) => {
  const providerId = req.user.id;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const bookings = await Booking.find({ providerId })
    .populate("userId", "name email address phone")
    .populate("providerId", "services charge")
    .sort({ createdAt: -1 })
    .skip(skip) 
    .limit(limit); 
const totalBookings = await Booking.countDocuments({ providerId });
const totalPages = Math.ceil(totalBookings / limit);

const formattedBookings = bookings.map((booking) => ({
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
  earnings: booking.numberOfDays * booking.providerId.charge,
}));

  res.status(200).json({
    status: "success",
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
  const { startDate, endDate } = req.body;

  // Fetch the booking to validate its status
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new CustomError("Booking not found.",404);
  }

  // Check if the booking is already completed or canceled
  if (booking.status === "completed") {
    throw new CustomError("Cannot reschedule a completed booking." ,400);
  }
  if (booking.status === "cancelled") {
    throw new CustomError("Cannot reschedule a canceled booking.",400);
  }
//   const newDateArray = Array.isArray(newDates) ? newDates : [newDates];

//   // Check if the new slot is already booked
//   const parsedNewDates = newDateArray.map((dateStr) => {
//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) {
//       throw new CustomError(`Invalid date format: ${dateStr}`, 400);
//     }
//     return date;
//   });

//   const newStartDate = parsedNewDates[0];
//   const newEndDate = parsedNewDates[parsedNewDates.length - 1];

  // Check if any of the new dates are already booked
  const conflictingBookings = await Booking.find({
    providerId: booking.providerId,
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Overlapping range
      { startDate: { $in: [startDate, endDate] } }, // Exact match on start date
      { endDate: { $in: [startDate, endDate] } }, // Exact match on end date
    ],
    _id: { $ne: bookingId }, // Exclude the current booking
  });

  if (conflictingBookings.length > 0) {
    throw new CustomError("One or more selected dates are already booked.",400);
  }

  // Update the booking with the new date and slot
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { startDate, endDate },
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

const createBooking = asyncErrorHandler(async (req, res) => {
  console.log("resd", req.body);
  const { user, provider, startDate, endDate, status = 'pending'} = req.body;
  if (!startDate || !endDate) {
    throw new CustomError("Start date and end date are required.", 400);
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
    throw new CustomError("Invalid start date or end date.", 400);
  }

  if (parsedStartDate >= parsedEndDate) {
    throw new CustomError("Start date must be before end date.", 400);
  }

  const userDetails = await User.findOne({email: user.email});
  if(!userDetails) {
    throw new CustomError("User not found",404);
  }

  const providerDetails = await Provider.findOne({email: provider.email});
  if(!providerDetails) {
     throw new CustomError("provider not found",404)
  }
  const timeDifference = parsedEndDate - parsedStartDate;
  const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  const existingBooking = await Booking.findOne({
    userId: userDetails._id,
    providerId:providerDetails._id,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
  });

  if (existingBooking) {
    throw new CustomError("A booking with the same details already exists.", 400);
  }

  const booking = new Booking({
    userId: userDetails._id,
    providerId: providerDetails._id,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    numberOfDays,
    status,
    isDeleted: false,
  });

  await booking.save();
  
  const populatedBooking = await Booking.findById(booking._id)
  .populate('userId', 'name email')
  .populate('providerId', 'name services');
  res.status(201).json({
    status:"success",
    booking: populatedBooking,
    message: 'Booking created successfully',
  });
})

const editBooking = asyncErrorHandler(async(req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate, status } = req.body;

  // Fetch the booking to validate its existence
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new CustomError("Booking not found.", 404);
  }

  // Check if the booking is already completed or canceled
  if (booking.status === "completed") {
    return res.status(400).json({
      status: "error",
      message: "Cannot edit a completed booking.",
    });
  }
  if (booking.status === "cancelled") {
    return res.status(400).json({
      status: "error",
      message: "Cannot edit a canceled booking.",
    });
  }

  // Validate and parse dates
  let parsedStartDate, parsedEndDate;
  if (startDate) {
    parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate.getTime())) {
      throw new CustomError("Invalid start date.", 400);
    }
  }
  if (endDate) {
    parsedEndDate = new Date(endDate);
    if (isNaN(parsedEndDate.getTime())) {
      throw new CustomError("Invalid end date.", 400);
    }
  }

  // Ensure startDate is before endDate
  if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
    throw new CustomError("Start date must be before end date.", 400);
  }

  if (parsedStartDate || parsedEndDate) {
    const conflictingBookings = await Booking.find({
      providerId: booking.providerId,
      _id: { $ne: bookingId }, // Exclude the current booking
      $or: [
        { startDate: { $lte: parsedEndDate || booking.endDate }, endDate: { $gte: parsedStartDate || booking.startDate } },
      ],
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "The selected dates conflict with existing bookings.",
      });
    }}

    const updates = {};
  if (parsedStartDate) updates.startDate = parsedStartDate;
  if (parsedEndDate) updates.endDate = parsedEndDate;
  if (status) updates.status = status;

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    updates,
    { new: true } // Return the updated document
  );
  res.status(200).json({
    status: "success",
    message: "Booking updated successfully.",
    booking: updatedBooking,
  });
})

const deleteBooking = asyncErrorHandler(async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ _id: bookingId, isDeleted: false });

    if (!booking) {
      throw new CustomError('Booking not found',404);
    }

    booking.isDeleted = true;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
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
