const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const bcrypt = require("bcryptjs");
const Provider = require('../models/providerModel'); 
const Bookings = require('../models/bookingModel'); 
const Admin = require('../models/adminModel');
const CustomError = require('../utils/customError');
const { sentRefreshToken, generateToken, generateRefreshToken } = require('../utils/jwt');
const Payment = require('../models/paymentModel');

const adminLoginService = async (res, data) => {
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
  sentRefreshToken(res, refreshToken);

  return {
    message: "admin logged in successfully",
    token,
    refreshToken,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role
    },
  };
};

const getStatsService = async () => {
  const totalUsers = await User.countDocuments();
  const totalProviders = await Provider.countDocuments();
  const totalBookings = await Bookings.countDocuments();
  
  const totalRevenueResult = await Payment.aggregate([
    { $match: { status: 'successful' } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  
  const totalRevenue = totalRevenueResult[0]?.total || 0;

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

const getBookingsByUserService = async (userId) => {
    const bookings = await Booking.find({ userId })
      .populate('providerId', 'name address services charge') 
      .sort({ date: 1, slot: 1 }); 

    if (!bookings || bookings.length === 0) {
      throw new Error("No bookings found for this user.");
    }

    return bookings; 
  };

  
module.exports = { adminLoginService, getStatsService, getUserByIdService, getBookingsByUserService };
