import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { Bar, Line , Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);


const DashBoard = () => {
  const [stats, setStats] = useState({
    totalBookingsForToday: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalBookings: 0,
    totalEarnings: 0,
  });
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [todaysBookings, setTodaysBookings] = useState([]);
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

  const fetchMonthlyBookings = async () => {
    try {
      const response = await axiosInstance.get("/providers/monthly-bookings");
      console.log("rty",response)
      setMonthlyBookings(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch monthly bookings data");
    }
  };

  const fetchMonthlyEarnings = async () => {
    try {
      const response = await axiosInstance.get("/providers/monthly-earnings");
      setMonthlyEarnings(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch monthly earnings data");
    }
  };


  const fetchTodaysBookings = async () => {
    try {
      const response = await axiosInstance.get("/providers/today-bookings");
      console.log("ju", response.data.data);
      setTodaysBookings(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch today's bookings data");
    }
  };


  useEffect(() => {
    fetchStats();
    fetchMonthlyBookings();
    fetchMonthlyEarnings();
    fetchTodaysBookings();
  }, []);

  const barChartData = {
    labels: monthlyEarnings.map((month) => month.month), // Use short month names
    datasets: [
      {
        label: "Earnings per Month",
        data: monthlyEarnings.map((month) => month.totalEarnings),
        backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
        barThickness: 50,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { font: { size: 14 } },
        categoryPercentage: 0.6, 
        barPercentage: 0.8,
      },
      y: {
        ticks: { font: { size: 14 } },
        beginAtZero: true,
      },
    },
  };
  
  const pieChartData = {
    labels: ["Pending", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Booking Status",
        data: [
          stats.pendingBookings,
          stats.completedBookings,
          stats.cancelledBookings,
        ],
        backgroundColor: ['#6366F1', '#10B981', '#F59E0B'],
        hoverBackgroundColor: ['#4f46e5', '#059669', '#d97706'],
      },
    ],
  };

  const lineChartData = {
    labels: monthlyBookings.map((month) => month.month), // Use short month names
    datasets: [
      {
        label: "Bookings per Month",
        data: monthlyBookings.map((month) => month.count),
        borderColor: "#059669",
        backgroundColor: "#059669",
        fill: false,
        tension: 0.1,
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
            <h2 className="text-xl font-semibold mb-4 text-center sm:text-left text-black-default">
              Today&apos;s Bookings
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black-default uppercase tracking-wider">
                    Customer Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black-default uppercase tracking-wider">
                      Customer contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black-default uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black-default uppercase tracking-wider">
                      End Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black-default uppercase tracking-wider">
                      Number of Days
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black-default uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50 divide-y divide-gray-200">
                  {todaysBookings.length > 0 ? (
                    todaysBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black-default">
                          {booking.userId.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black-default">
                          {booking.userId.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black-default">
                          {booking.startDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black-default">
                          {booking.endDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black-default">
                          {booking.numberOfDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black-default">
                          {booking.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-center text-black-default">
                        No bookings for today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 bg-white-default shadow-lg rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center sm:text-left text-black-default">Monthly Earnings</h2>
          <div className="h-[300px]">
          <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

<div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white-default shadow-lg rounded-lg mt-8">
            <h2 className="text-xl font-semibold mb-4 text-center sm:text-left text-black-default">
              Booking Status Distribution
            </h2>
            <div className="h-[300px] flex justify-center items-center">
              <Pie data={pieChartData} options={{ responsive: true }}/>
            </div>
          </div>

          <div className="p-6 bg-white-default shadow-lg rounded-lg mt-8">
            <h2 className="text-xl font-semibold mb-4 text-center sm:text-left text-black-default">
              Monthly Bookings Overview
            </h2>
            <div className="h-[300px] flex justify-center items-center">
              <Line data={lineChartData} options={{ responsive: true }} />
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashBoard;
