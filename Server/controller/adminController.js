const { getStatsService, adminLoginService, getUserByIdService } = require("../services/adminService");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { loginValidation } = require("../validations/userValidations");

const adminLogin = asyncErrorHandler(async(req,res) => {
  const {error} = loginValidation(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);

  const data = await adminLoginService(req.body);
  res.cookie('refreshToken', data.refreshToken, {
    httpOnly: true,      
    secure: true,          
    sameSite: 'Strict',   
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ status: "success", data})
})
const getStats = asyncErrorHandler(async(req,res) => {
  const { totalUsers, totalProviders, totalBookings, totalRevenue } = await getStatsService();
  
  res.status(200).json({
    status: "success",
    message: "Successfully retrieved stats",
    totalUsers,
    totalProviders,
    totalBookings,
    totalRevenue,
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

module.exports = { adminLogin, getAllUsers, getUserById, getStats };