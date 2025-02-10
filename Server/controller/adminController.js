const Booking = require("../models/bookingModel");
const { getStatsService, adminLoginService, getUserByIdService } = require("../services/adminService");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { loginValidation } = require("../validations/userValidations");

const adminLogin = asyncErrorHandler(async(req,res) => {
  const {error} = loginValidation(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);

  const data = await adminLoginService(res,req.body);
  res.status(200).json({ status: "success", data})
});

const getStats = asyncErrorHandler(async(req,res) => {
  const data = await getStatsService();
  
  res.status(200).json({
    status: "success",
    message: "Successfully retrieved stats",
    data
  });
});

const getAllUsers = asyncErrorHandler(async (req, res) => {
   const result = await allUsersService();
  res.status(200).json({status:"success",message:"All users retrieved successfully",result});
});

const getUserById = asyncErrorHandler(async (req,res) => {
  const userId = req.params.id;
  const data = await getUserByIdService(userId);
  res.status(200).json({status:"success",message:"User retrieved successfully", data});
});

const getBookingByUser = asyncErrorHandler(async (req, res) => {
  const userId = req.params;
  const bookings = await Booking.find(userId)
      .populate('providerId', 'name address services charge')
      .sort({ date: 1 , slot: 1});
  res.status(200).json({ status: "success", message: "Bookings fetched successfully", bookings });
});

const createBooking = asyncErrorHandler(async (req, res) => {
  const newBooking = await Booking.create({
    user: req.body.userId,
    provider: req.body.providerId,
    services: req.body.services,
    date: req.body.date,
    slot: req.body.slot,
    status: 'pending'
  });

  const populatedBooking = await Booking.findById(newBooking._id)
    .populate('user', 'name email phone')
    .populate('provider', 'name email services');

  res.status(201).json({
    status: 'success',
    booking: populatedBooking
  });
});


module.exports = { adminLogin, getAllUsers, getUserById, getStats, getBookingByUser };