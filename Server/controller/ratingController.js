const Rating = require('../models/ratingModel'); 
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");

const createRating = asyncErrorHandler(async (req, res) => {
    const { bookingId, userId, providerId, rating, comment } = req.body;

    // Validate required fields
    if (!bookingId || !userId || !providerId || !rating) {
      throw new CustomError("All fields are required except comment.", 400);
    }

    // Check if the rating is within the valid range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    // Check if a rating already exists for this booking
    const existingRating = await Rating.findOne({ bookingId });
    if (existingRating) {
      return res.status(400).json({ message: "A rating for this booking already exists." });
    }

    // Create the rating
    const newRating = new Rating({
      bookingId,
      userId,
      providerId,
      rating,
      comment,
    });

    await newRating.save();

    res.status(201).json({ message: "Rating submitted successfully.", rating: newRating });
  
});

// Get all ratings
const getAllRatings = asyncErrorHandler(async (req, res) => {
      const ratings = await Rating.find({ isDeleted: false })
        .populate('bookingId')
        .populate('userId')
        .populate('providerId');
  
      res.status(200).json({ ratings });
  });

// Get a single rating by ID
const getRatingById = asyncErrorHandler(async (req, res) => {
      const { id } = req.params;
  
      const rating = await Rating.findById({ id, isDeleted: false })
        .populate('bookingId')
        .populate('userId')
        .populate('providerId');
  
      if (!rating) {
        return res.status(404).json({ message: "Rating not found." });
      }
  
      res.status(200).json({ rating });

});

// Update a rating
const updateRating = asyncErrorHandler(async (req, res) => {
      const { id } = req.params;
      const { rating, comment } = req.body;
  
      // Validate input
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
      }
  
      // Find the rating by ID
      const existingRating = await Rating.findById(id);
      if (!existingRating) {
        return res.status(404).json({ message: "Rating not found." });
      }
  
      // Update the rating fields
      if (rating !== undefined) existingRating.rating = rating;
      if (comment !== undefined) existingRating.comment = comment;
  
      await existingRating.save();
  
      res.status(200).json({ message: "Rating updated successfully.", rating: existingRating });

});

// Delete a rating
const deleteRating = asyncErrorHandler(async (req, res) => {
      const { id } = req.params;
  
      const updatedRating = await Rating.findByIdAndUpdate(
        id,
        { isDeleted: true }, // Set isDeleted to true
        { new: true } // Return the updated document
      );
      if (!updatedRating) {
        return res.status(404).json({ message: "Rating not found." });
      }
  
      res.status(200).json({ message: "Rating deleted successfully.", rating: updatedRating });

});

// Get ratings by provider ID
const getRatingsByProvider = asyncErrorHandler(async (req, res) => {
      const { providerId } = req.params;
  
      const ratings = await Rating.find({ providerId, isDeleted: false })
        .populate('bookingId')
        .populate('userId');
  
      res.status(200).json({ ratings });

});

// Get average rating for a provider
const getAverageRating = asyncErrorHandler(async (req, res) => {
      const { providerId } = req.params;
  
      const result = await Rating.aggregate([
        { $match: { providerId: mongoose.Types.ObjectId(providerId) } },
        { $group: { _id: null, averageRating: { $avg: "$rating" } } },
      ]);
  
      const averageRating = result.length > 0 ? result[0].averageRating : 0;
  
      res.status(200).json({ averageRating });

});

const getRatingsByUser = asyncErrorHandler(async (req, res) => {
      const userId = req.user.id; 
  
      // Fetch all ratings where the userId matches
      const ratings = await Rating.find({ userId, isDeleted: false })
        .populate('bookingId') // Populate booking details if needed
        .populate('providerId'); // Populate provider details if needed
  
      if (!ratings || ratings.length === 0) {
        return res.status(404).json({ message: "No ratings found for this user." });
      }
  
      res.status(200).json({ ratings });
});

module.exports = { createRating, getAllRatings, getAverageRating, getRatingById, updateRating, deleteRating, getRatingsByProvider, getRatingsByUser };