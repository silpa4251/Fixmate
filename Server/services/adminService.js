const User = require('../models/userModel').default;
const Provider = require('../models/providerModel').default; 
const Bookings = require('../models/bookingModel'); 

const getStatsService = async () => {
  const totalUsers = await User.countDocuments();
  const totalProviders = await Provider.countDocuments();
  const totalBookings = await Bookings.countDocuments();
  
  const totalRevenueResult = await Bookings.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: '$totalCost' } } },
  ]);
  
  const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

  return {
    totalUsers,
    totalProviders,
    totalBookings,
    totalRevenue,
  };
};

module.exports = { getStatsService };
