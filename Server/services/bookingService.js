const Booking = require("../models/bookingModel");
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
    
      const booking = await Booking.create({
        userId,
        providerId,
        startDate,
        endDate,
        numberOfDays,
        status: "pending",
      });
    return {booking};
    
}

module.exports = { newBookingService };