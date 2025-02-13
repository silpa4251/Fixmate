import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Search, Calendar, User, Mail, Phone, MapPin, X, Wallet } from "lucide-react";
import { toast } from "react-toastify";

const TotalBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // New state for date filter
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  // Fetch bookings for the logged-in provider
  useEffect(() => {
    fetchProviderBookings();
  }, []);

  // Filter bookings based on search term, status, and date
  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, dateFilter, bookings]);

  const fetchProviderBookings = async () => {
    try {
      const response = await axiosInstance.get("/providers/bookings");
      console.log("hyt",response.data.bookings)
      setBookings(response.data.bookings);
      setFilteredBookings(response.data.bookings);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch bookings.");
      setLoading(false);
    }
  };

  const handleUpdateBooking = async (bookingId, updatedData) => {
    try {
      const response = await axiosInstance.patch(`/bookings/${bookingId}/status`, updatedData);
      console.log("res", response.data);
      if (response.data.booking) {
        toast.success("Booking status updated successfully");
        // Update the local state to reflect the change immediately
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, ...updatedData }
            : booking
        ));
      } else {
        toast.error("Failed to update booking status");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update booking status");
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === statusFilter
      );
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.startDate);
            return bookingDate >= today && bookingDate < tomorrow;
          });
          break;

        case "tomorrow":
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.startDate);
            return bookingDate >= tomorrow && bookingDate < new Date(tomorrow.getTime() + 86400000); // End of tomorrow
          });
          break;

        default:
          break;
      }
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.userId?.name?.toLowerCase().includes(searchLower) ||
          booking.providerId?.services?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setIsViewModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Booking History</h2>

      {/* Search, Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by user name or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black-default"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white-default text-black-default"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white-default text-black-default"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white-default text-left text-sm text-gray-500">
          <thead className="bg-green-200 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Service</th>
              <th className="px-6 py-3">Start Date</th>
              <th className="px-6 py-3">End Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr
                key={booking._id}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white-default"} border-b hover:bg-gray-100`}
              >
                <td className="px-6 py-4">{booking.userId?.name || "N/A"}</td>
                <td className="px-6 py-4">{booking.providerId?.services || "N/A"}</td>
                <td className="px-6 py-4">{new Date(booking.startDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">{new Date(booking.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      defaultValue={booking.earnings || 0}
                      onBlur={(e) => handleUpdateBooking(booking._id, { earnings: parseFloat(e.target.value) })}
                      className="w-20 px-2 py-1 border rounded text-black-default focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={booking.status}
                    onChange={(e) => handleUpdateBooking(booking._id, { status: e.target.value })}
                    className={`px-3 py-1.5 border rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer ${getStatusColor(booking.status)}`}
                  >
                    <option value="confirmed" className="bg-yellow-100 text-yellow-800">Confirmed</option>
                    <option value="completed" className="bg-green-100 text-green-800">Completed</option>
                    <option value="cancelled" className="bg-red-100 text-red-800">Cancelled</option>
                  </select>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewBooking(booking)}
                    className="bg-green-500 text-white-default py-1 px-4 rounded hover:bg-green-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Booking Modal */}
      {isViewModalOpen && viewBooking && (
        <div className="fixed inset-0 bg-black-default bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white-default rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                {/* Booking Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 text-gray-900">Booking Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium text-black-default">
                          {new Date(viewBooking.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-medium text-black-default">
                          {new Date(viewBooking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Details */}
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 text-gray-900">User Details</h4>
                  <div className="space-y-3 grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-black-default">{viewBooking.userId?.name || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-black-default">{viewBooking.userId?.email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-black-default">{viewBooking.userId?.phone || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Place</p>
                        <p className="font-medium text-black-default">{viewBooking.userId?.address?.place || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </div>

                {/* Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-4 text-gray-900">Amount</h4>
                        <span className= "px-3 py-1 rounded-full text-sm  text-black-default">
                            {viewBooking.earnings}
                        </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-4 text-gray-900">Status</h4>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(viewBooking.status)}`}>
                            {viewBooking.status}
                        </span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalBookings;