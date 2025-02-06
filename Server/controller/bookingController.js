const Booking = require("../models/bookingModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const { generateSlots, parseTime } = require("../utils/generateSlots");

// Create a new booking
const newBooking = asyncErrorHandler(async (req, res) => {
    const { providerId, date, slot } = req.body;
    const userId = req.user.userId;

    // Check for duplicate bookings
    const existingBooking = await Booking.findOne({ userId, providerId, date, slot });
    if (existingBooking) {
        return res.status(400).json({ status: "error", message: "You already have a booking for this slot." });
    }

    const booking = new Booking({ userId, providerId, date, slot });
    await booking.save();

    res.status(201).json({ status: "success", message: "Booking successful!", booking });
});

// Fetch available slots
const availableSlots = asyncErrorHandler(async (req, res) => {
    const { providerId, date } = req.query;
    const requestedDate = new Date(date);
    const currentDate = new Date();
    const isToday = requestedDate.toDateString() === currentDate.toDateString();

    const bookings = await Booking.find({ providerId, date});
    const bookedSlots = bookings.map((booking) => booking.slot);

    const allSlots = generateSlots("08:00", "17:00", 120, 30);

    let availableSlots = [...allSlots];
    if (isToday) {
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();

        availableSlots = availableSlots.filter((slot) => {
            const [startTime, endTime] = slot.split("-");
            const [startHour, startMinute] = parseTime(startTime);
            const [endHour, endMinute] = parseTime(endTime);

            const slotStartMinutes = startHour * 60 + startMinute;
            const slotEndMinutes = endHour * 60 + endMinute;
            const currentTimeInMinutes = currentHours * 60 + currentMinutes;

            return slotEndMinutes > currentTimeInMinutes;
        });
    }
    availableSlots = availableSlots.filter((slot) => !bookedSlots.includes(slot));
    res.status(200).json({ status: "success", message: "Available slots fetched", availableSlots });
});

// Get user bookings
const getUserBookings = asyncErrorHandler(async (req, res) => {
    if (!req.user?.userId) {
        return res.status(400).json({ status: "error", message: "User ID missing" });
    }
    const bookings = await Booking.find({ userId: req.user.userId })
        .populate('providerId', 'name address services charge')
        .sort({ date: 1 , slot: 1});

    res.status(200).json({ status: "success", message: "Bookings fetched successfully", bookings });
});

// Get provider bookings
const getProviderBookings = asyncErrorHandler(async (req, res) => {
    const { providerId } = req.params;

    const bookings = await Booking.find({ providerId })
        .populate('userId', 'name email')
        .populate('serviceId', 'name price')
        .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", message: "Bookings fetched successfully", bookings });
});

const bookingById = asyncErrorHandler(async(req, res) => {
    const { bookingId }= req.params;
    const booking = await Booking.findById(bookingId)
                    .populate('providerId', 'name address services charge')
                    .populate('userId', 'name email');
    console.log("id", booking);
    if (!booking) {
        return res.status(404).json({status: "error",message: "Booking not found."});
    }
    res.status(200).json({
        status: "success",
        message: "Booking details fetched successfully.",
        booking,
    });            
});

const rescheduleBookings = asyncErrorHandler(async (req, res) => {
    console.log("objectparams",req.params);
    console.log("boduy", req.body);
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
        return res.status(400).json({ status: "error", message: "Invalid status value." });
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
    ).populate('userId');

    res.status(200).json({
        status: "success",
        message: "Booking status updated successfully.",
        booking: updatedBooking,
    });
});

module.exports = { newBooking, availableSlots, getUserBookings, getProviderBookings, bookingById, rescheduleBookings, updateBookingStatus };