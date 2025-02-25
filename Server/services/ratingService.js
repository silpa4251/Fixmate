const Rating = require("../models/Rating");
const Booking = require("../models/Booking");
const CustomError = require("../utils/CustomError");

const createRating = async ({ id, rating, comment }) => {
  // Validate required fields
  if (!id || !rating) {
    throw new CustomError("All fields are required except comment.", 400);
  }

  // Check if rating is within the valid range
  if (rating < 1 || rating > 5) {
    throw new CustomError("Rating must be between 1 and 5.", 400);
  }

  // Check if rating already exists for this booking
  const existingRating = await Rating.findOne({ bookingId: id });
  if (existingRating) {
    throw new CustomError("A rating for this booking already exists.", 400);
  }

  // Fetch the booking details
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new CustomError("Booking not found.", 404);
  }

  // Create the rating
  const newRating = new Rating({
    bookingId: id,
    userId: booking.userId,
    providerId: booking.providerId,
    rating,
    comment,
  });

  await newRating.save();

  return newRating;
};

module.exports = { createRating };
