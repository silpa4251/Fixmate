import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const DashBoard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/admin/stats");
      console.log("fdd",response.data.data.data)
      setStats(response.data.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = {
    labels: ["Users", "Providers", "Bookings", "Revenue"],
    datasets: [
      {
        label: "Statistics",
        data: [
          stats.totalUsers,
          stats.totalProviders,
          stats.totalBookings,
          stats.totalRevenue,
        ],
        backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#EC4899'],
        barThickness: 50,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-black-default mb-8">Overview</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Total Bookings</h2>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>

          <div className="p-5 bg-gradient-to-r from-teal-500 to-green-500 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Pending Bookings</h2>
            <p className="text-2xl font-bold">{stats.totalProviders}</p>
          </div>

          <div className="p-5 bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Rating</h2>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
          </div>

          <div className="p-5 bg-gradient-to-r from-pink-500 to-red-500 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Total Revenue</h2>
            <p className="text-2xl font-bold">Rs.{stats.totalRevenue}</p>
          </div>
        </div>

          <div className="p-6 bg-white-default shadow-lg rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center sm:text-left text-black-default">Stats Overview</h2>
          <div className="relative" style={{ width: '80%', height: '300px' }}>
          <Bar data={chartData} options={{ responsive: true }} />
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default DashBoard;
