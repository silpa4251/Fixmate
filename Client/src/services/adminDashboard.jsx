import axiosInstance from "../api/axiosInstance";

// Fetch total users
export const fetchTotalUsers = async () => {
  const response = await axiosInstance.get("/admin/stats/total-users");
  const totalUsers = response.data.data.userStats[0].userCount || 0;
  return totalUsers;
};

// Fetch total revenue
export const fetchTotalRevenue = async () => {
  const response = await axiosInstance.get("/admin/stats/total-revenue");
  return response.data.data.totalRevenue || 0;
};

// Fetch total products
export const fetchTotalProducts = async () => {
  const response = await axiosInstance.get("/admin/stats/total-purchased-products");
  return response.data.data.totalProducts || 0;
};

// Fetch total orders
export const fetchTotalOrders = async () => {
  const response = await axiosInstance.get("/admin/stats/total-orders");
  return response.data.data.orderStats[0].totalOrders || 0;
};

// Fetch top customers
export const fetchTopCustomers = async () => {
  const response = await axiosInstance.get("/admin/stats/top-customers");
  return response?.data?.data?.topCustomers || [];
};

// Fetch recent orders
export const fetchRecentOrders = async () => {
  const response = await axiosInstance.get("/admin/orders");
  return response?.data?.data?.orders || [];
};
