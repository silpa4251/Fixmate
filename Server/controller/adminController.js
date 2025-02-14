const { RESPONSE } = require("../constants/response");
const Booking = require("../models/bookingModel");
const { getStatsService, adminLoginService, getUserByIdService, getBookingsByUserService } = require("../services/adminService");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { loginValidation } = require("../validations/userValidations");

const adminLogin = asyncErrorHandler(async(req,res) => {
  const {error} = loginValidation(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);

  const data = await adminLoginService(res,req.body);
  res.status(200).json({  status: RESPONSE.success, data})
});

const getStats = asyncErrorHandler(async(req,res) => {
  const data = await getStatsService();
  
  res.status(200).json({
    status: RESPONSE.success,
    message: "Successfully retrieved stats",
    data
  });
});

// const getAllUsers = asyncErrorHandler(async (req, res) => {
//    const result = await allUsersService();
//   res.status(200).json({status:"success",message:"All users retrieved successfully",result});
// });

const getUserById = asyncErrorHandler(async (req,res) => {
  const userId = req.params.id;
  const data = await getUserByIdService(userId);
  res.status(200).json({ status: RESPONSE.success,message:"User retrieved successfully", data});
});

const getBookingByUser = asyncErrorHandler(async (req, res) => {
  const { id } = req.params; 

  const bookings = await getBookingsByUserService(id);
  res.status(200).json({  status: RESPONSE.success, message: "Bookings fetched successfully", bookings });
});




module.exports = { adminLogin, getUserById, getStats, getBookingByUser };