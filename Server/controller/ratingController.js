const Rating = require('../models/ratingModel'); 
const Booking = require("../models/bookingModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const { mongoose } = require('mongoose');
const { generatePresignedUrl } = require('../middlewares/multer');
const Provider= require("../models/providerModel");

const createRating = asyncErrorHandler(async (req, res) => {
    const { id, rating, comment } = req.body;

    // Validate required fields
    if ( !id || !rating ) {
      throw new CustomError("All fields are required except comment.", 400);
    }

    // Check if the rating is within the valid range
    if (rating < 1 || rating > 5) {
      throw new CustomError("Rating must be between 1 and 5.", 400);
    }

    // Check if a rating already exists for this booking
    const existingRating = await Rating.findOne({ bookingId: id });
    if (existingRating) {
      throw new CustomError("A rating for this booking already exists.", 400);
    }

    const booking = await Booking.findOne({_id: id});

    // Create the rating
    const newRating = new Rating({
      bookingId: id,
      userId: booking.userId,
      providerId: booking.providerId,
      rating,
      comment,
    });

    const savedRating = await newRating.save();
  
    // Update the provider document to include this rating reference
    await Provider.findByIdAndUpdate(
      booking.providerId,
      { $push: { rating: savedRating._id } }
    );

    res.status(201).json({ message: "Rating submitted successfully.",     rating: savedRating  });
  
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
  
      const rating = await Rating.find({ id, isDeleted: false })
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
      const feedback = await Rating.findById(existingRating._id)
      .populate('bookingId')
      .populate('userId')
      .populate('providerId');
  
      res.status(200).json({ message: "Rating updated successfully.", feedback });

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
  
      const feedbacks = await Rating.find({ providerId, isDeleted: false })
        .populate('bookingId')
        .populate('userId');
  
      res.status(200).json({ feedbacks });

});

// Get average rating for a provider
const getAverageRating = asyncErrorHandler(async (req, res) => {
      const { providerId } = req.params;
  
      const result = await Rating.aggregate([
        { $match: { providerId: new mongoose.Types.ObjectId(providerId) } },
        { $group: { _id: null, averageRating: { $avg: "$rating" } } },
      ]);
      const averageRating = result.length > 0 ? result[0].averageRating : 0;
  
      res.status(200).json({ averageRating });

});

const getRatingsByUser = asyncErrorHandler(async (req, res) => {
      const userId = req.user.id; 
  
      // Fetch all ratings where the userId matches
      const feedbacks = await Rating.find({ userId, isDeleted: false })
        .populate('bookingId') 
        .populate('providerId');
  
      if (!feedbacks || feedbacks.length === 0) {
        return res.status(404).json({ message: "No ratings found for this user." });
      }

      const feedbacksWithUrls = await Promise.all(feedbacks.map(async (feedback) => {
        const feedbackObj = feedback.toObject();
        if (feedbackObj.providerId && feedbackObj.providerId.image) {
          feedbackObj.providerId.image = await generatePresignedUrl(feedbackObj.providerId.image);
        }
        return feedbackObj;
      }));
  
      res.status(200).json({ feedbacks: feedbacksWithUrls});
});

const getRatingForProvider = asyncErrorHandler(async (req, res) => {
  const providerId = req.user.id; 

  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;
  const totalRatings = await Rating.countDocuments({ providerId, isDeleted: false });

  // Fetch all ratings where the userId matches
  const feedbacks = await Rating.find({ providerId, isDeleted: false })
    .populate('bookingId') 
    .populate('userId')
    .skip(skip) // Skip documents based on the current page
    .limit(limit); 

  if (!feedbacks || feedbacks.length === 0) {
    return res.status(404).json({ message: "No ratings found for this user." });
  }
  const totalPages = Math.ceil(totalRatings / limit);

  res.status(200).json({ feedbacks,
    pagination: {
      currentPage: page,
      totalPages,
      totalRatings,
      limit,
    },
   });
});

module.exports = { createRating, getAllRatings, getAverageRating, getRatingById, updateRating, deleteRating, getRatingsByProvider, getRatingsByUser, getRatingForProvider };