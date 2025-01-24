const { getStatsService } = require("../services/adminService");
const asyncErrorHandler = require("../utils/asyncErrorHandler");


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
  const user = await User.findById(userId);
  if(!user) {
      throw new CustomError("User not found",404);
  }
  res.status(200).json({status:"success",message:"User retrieved successfully",user});
});
module.exports = { getAllUsers, getUserById, getStats };