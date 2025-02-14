import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { Bar, Line , Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const DashBoard = () => {
  const [stats, setStats] = useState({
    totalBookingsForToday: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalBookings: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/providers/stats");
      setStats(response.data.data);
      setLoading(false);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = {
    labels: ["Pending", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Statistics",
        data: [
          stats.pendingBookings,
          stats.completedBookings,
          stats.cancelledBookings,
        ],
        backgroundColor: ['#6366F1', '#10B981', '#F59E0B'],
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
            <h2 className="text-xl font-semibold">Bookings for Today</h2>
            <p className="text-2xl font-bold">{stats.totalBookingsForToday}</p>
          </div>

          <div className="p-5 bg-gradient-to-r from-teal-500 to-green-500 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Completed Bookings</h2>
            <p className="text-2xl font-bold">{stats.completedBookings}</p>
          </div>

          <div className="p-5 bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Total Bookings</h2>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
          </div>

          <div className="p-5 bg-gradient-to-r from-pink-500 to-red-500 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Total Earnings</h2>
            <p className="text-2xl font-bold">Rs.{stats.totalEarnings}</p>
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
