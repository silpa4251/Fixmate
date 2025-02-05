const User = require('../models/userModel');
const Provider = require('../models/providerModel'); 
const Bookings = require('../models/bookingModel'); 
const Admin = require('../models/adminModel');
const CustomError = require('../utils/customError');

const adminLoginService = async (data) => {
  const { email, password } = data;
  const admin = await Admin.findOne({ email });
  const role = "Admin";

  if (!admin) {
    throw new CustomError("Invalid email", 400);
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }
  const token = generateToken(admin._id, role);
  const refreshToken = generateRefreshToken(admin._id, role);
  

  return {
    message: "admin logged in successfully",
    data: {
    token,
    refreshToken,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role
    },
  }
  };
};

const getStatsService = async () => {
  const totalUsers = await User.countDocuments();
  const totalProviders = await Provider.countDocuments();
  const totalBookings = await Bookings.countDocuments();
  
  const totalRevenueResult = await Bookings.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: '$totalCost' } } },
  ]);
  
  const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

  return {data: {
    totalUsers,
    totalProviders,
    totalBookings,
    totalRevenue,
  }
  };
};

const getUserByIdService = async (id) => {
  if(!id){
    throw new CustomError("Id is required", 400);
  }
  const user = await User.findById(id);
  if(!user) {
      throw new CustomError("User not found",404);
  }
  return { data: {user}};
}
 
module.exports = { adminLoginService, getStatsService, getUserByIdService };
