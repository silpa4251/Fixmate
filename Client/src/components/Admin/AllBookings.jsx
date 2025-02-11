import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Search, X, Calendar, Clock, User, Mail, Phone, Building2, Wrench, Plus, ChevronDown, Edit } from "lucide-react";
// import { useNavigate } from "react-router-dom";

const AllBookings = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  // const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, details]);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get("/admin/bookings");
      setDetails(response.data.bookings);
      setFilteredBookings(response.data.bookings);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch bookings.");
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...details];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        booking =>
          booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.provider.services.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        booking => booking.status.toLowerCase() === statusFilter
      );
    }

    setFilteredBookings(filtered);
  };

  // const handleAddBooking = () => {
  //   navigate("/admin/bookings/add");
  // };

  // const handleEditBooking = (bookingId) => {
  //   navigate(`/admin/bookings/edit/${bookingId}`);
  // };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      Loading...
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 p-4">
      Error: {error}
    </div>
  );

  return (
    <div className="p-4 min-h-screen">
    <h2 className="text-xl font-bold mb-4 text-gray-700">Booking History</h2>

    {/* Search, Filter, and Action Buttons Section */}
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black-default"
        />
      </div>

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
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />

        {/* <button
          onClick={handleAddBooking}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white-default rounded-lg hover:bg-green-600"
        >
          <Plus size={20} />
          Add Booking
        </button> */}
      </div>

      <div className="bg-white-default rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-green-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Time Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((data, index) => (
                <tr
                  key={data._id || index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white-default"} hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 text-sm text-gray-800">{data.user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{data.provider.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{data.provider.services}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(data.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{data.slot}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(data.status)}`}>
                      {data.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                  {/* <button
                        onClick={() => handleEditBooking(data._id)}
                        className="flex items-center gap-2 py-1 px-3 rounded text-white-default bg-blue-500 hover:bg-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button> */}
                    <button
                      onClick={() => handleViewBooking(data)}
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black-default bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white-default rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedBooking && (
                <div className="space-y-6">
                  {/* Booking Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-4 text-gray-900">
                      Booking Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium text-black-default">
                            {new Date(selectedBooking.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Time Slot</p>
                          <p className="font-medium text-black-default">{selectedBooking.slot}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-4 text-gray-900">
                      User Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium text-black-default">{selectedBooking.user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-black-default">{selectedBooking.user.email}</p>
                        </div>
                      </div>
                      {selectedBooking.user.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-black-default">{selectedBooking.user.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Provider Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-4 text-gray-900">
                      Provider Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium text-black-default">{selectedBooking.provider.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wrench className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Service</p>
                          <p className="font-medium text-black-default">{selectedBooking.provider.services}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-4 text-gray-900">
                      Status
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;