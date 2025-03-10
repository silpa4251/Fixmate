const { generatePresignedUrl } = require("../middlewares/multer");
const Booking = require("../models/bookingModel");
const Provider= require("../models/providerModel");
const CustomError = require("../utils/customError");

const newBookingService = async(userId,data) => {
    const { providerId, startDate, endDate, numberOfDays } = data;

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

      const provider = await Provider.findById(providerId);
      if (!provider) {
          throw new CustomError("Provider not found", 404);
      }
  
      const { charge } = provider;
      const amount = charge * numberOfDays;
    
      const booking = await Booking.create({
        userId,
        providerId,
        startDate,
        endDate,
        numberOfDays,
        amount,
        status: "pending",
      });
    return {booking};
    
}

const getProviderBookedDatesService = async (providerId) => {
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
  return {bookedDates};
};

const checkAvailabilityService = async (providerId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlappingBookings = await Booking.find({
    provider: providerId,
    status: "confirmed",
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

  return overlappingBookings.length === 0;
};

const getAllBookingsService = async (page, limit) => {
  const skip = (page - 1) * limit;

  const bookings = await Booking.aggregate([
    {
      $match: { isDeleted: false },
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
        amount: 1,
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

  return { bookings, totalBookings, totalPages };
};

const getUserBookingsService = async (userId ) => {
  // const skip = (page - 1) * limit;

  const bookings = await Booking.find({ userId })
    .populate("providerId", "name image address services charge status")
    .sort({ date: 1 });

    const processedBookings = await Promise.all(bookings.map(async (booking) => {
      const bookingObj = booking.toObject();
      
      // Handle provider image if it exists
      if (bookingObj.providerId && bookingObj.providerId.image) {
        bookingObj.providerId.image = await generatePresignedUrl(bookingObj.providerId.image);
      }
      
      // Handle any booking images if they exist
      if (bookingObj.image) {
        bookingObj.image = await generatePresignedUrl(bookingObj.image);
      }
      return bookingObj;
    }));
    
  // const totalBookings = await Booking.countDocuments({ userId });

  // const totalPages = Math.ceil(totalBookings / limit);

  return {
    bookings: processedBookings,
    // pagination: {
    //   currentPage: page,
    //   totalPages,
    //   totalBookings,
    //   limit,
    // },
  };
};

const getProviderBookingsService = async (providerId, page, limit) => {
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
      address: booking.userId.address?.[0] || null,
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

  return { formattedBookings, totalBookings, totalPages };
};

const getBookingByIdService = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate("providerId", "name image address services charge")
    .populate("userId", "name phone address");

  if (!booking) {
    throw new CustomError("Booking not found.", 404);
  }
  if (booking.providerId && booking.providerId.image) {
    booking.providerId.image = await generatePresignedUrl(booking.providerId.image);
  }
  

  return { booking };
};

const rescheduleBookingService = async (bookingId, startDate, endDate) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new CustomError("Booking not found.", 404);
  }
  if (booking.status === "completed") {
    throw new CustomError("Cannot reschedule a completed booking.", 400);
  }
  if (booking.status === "cancelled") {
    throw new CustomError("Cannot reschedule a canceled booking.", 400);
  }

  // Check for conflicting bookings
  const conflictingBookings = await Booking.find({
    providerId: booking.providerId,
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, 
      { startDate: { $in: [startDate, endDate] } }, 
      { endDate: { $in: [startDate, endDate] } }, 
    ],
    _id: { $ne: bookingId },
  });

  if (conflictingBookings.length > 0) {
    throw new CustomError("One or more selected dates are already booked.", 400);
  }
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { startDate, endDate },
    { new: true }
  );

  return { updatedBooking };
};

const updateBookingStatusService = async (id, status) => {
  const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    throw new CustomError("Invalid status value.", 400);
  }
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new CustomError("Booking not found.", 404);
  }
  if (status === "cancelled" && booking.status === "completed") {
    throw new CustomError("Cannot cancel a completed booking.", 400);
  }
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("userId");

  return updatedBooking;
};

const createBookingService = async (user, provider, startDate, endDate, status = "pending") => {
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

  const userDetails = await User.findOne({ email: user.email });
  if (!userDetails) {
    throw new CustomError("User not found.", 404);
  }

  const providerDetails = await Provider.findOne({ email: provider.email });
  if (!providerDetails) {
    throw new CustomError("Provider not found.", 404);
  }

  const timeDifference = parsedEndDate - parsedStartDate;
  const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  const existingBooking = await Booking.findOne({
    userId: userDetails._id,
    providerId: providerDetails._id,
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
    .populate("userId", "name email")
    .populate("providerId", "name services");

  return populatedBooking;
};

const editBookingService = async (bookingId, startDate, endDate, status) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new CustomError("Booking not found.", 404);
  }

  if (booking.status === "completed") {
    throw new CustomError("Cannot edit a completed booking.", 400);
  }

  if (booking.status === "cancelled") {
    throw new CustomError("Cannot edit a canceled booking.", 400);
  }

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

  if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
    throw new CustomError("Start date must be before end date.", 400);
  }

  if (parsedStartDate || parsedEndDate) {
    const conflictingBookings = await Booking.find({
      providerId: booking.providerId,
      _id: { $ne: bookingId }, 
      $or: [
        { startDate: { $lte: parsedEndDate || booking.endDate }, endDate: { $gte: parsedStartDate || booking.startDate } },
      ],
    });

    if (conflictingBookings.length > 0) {
      throw new CustomError("The selected dates conflict with existing bookings.", 400);
    }
  }

  const updates = {};
  if (parsedStartDate) updates.startDate = parsedStartDate;
  if (parsedEndDate) updates.endDate = parsedEndDate;
  if (status) updates.status = status;

  const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updates, { new: true });

  return updatedBooking;
};

const deleteBookingService = async (bookingId) => {
  const booking = await Booking.findOne({ _id: bookingId, isDeleted: false });

  if (!booking) {
    throw new CustomError("Booking not found", 404);
  }

  booking.isDeleted = true;
  await booking.save();

  return { message: "Booking deleted successfully" };
};

module.exports = { newBookingService, getProviderBookedDatesService, checkAvailabilityService, getAllBookingsService, getUserBookingsService, getProviderBookingsService, getBookingByIdService, rescheduleBookingService, updateBookingStatusService, createBookingService, editBookingService, deleteBookingService };