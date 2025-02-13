import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Search, Plus, Edit, X, Calendar, User, Mail, Phone, Building2, Wrench } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import BookingForm from "./BookingForm";

const AllBookings = () => {
  const [details, setDetails] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editBooking, setEditBooking] = useState(null);

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

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        booking => booking.status.toLowerCase() === statusFilter
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        booking =>
          booking.user.name.toLowerCase().includes(searchLower) ||
          booking.provider.name.toLowerCase().includes(searchLower) ||
          booking.provider.services.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleModalOpen = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.patch(`/admin/bookings/${selectedBooking._id}`);
      setDetails(prevBookings =>
        prevBookings.filter(booking => booking._id !== selectedBooking._id)
      );
      toast.success("Booking deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete booking");
    } finally {
      setModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleEditBooking = (booking) => {
    setEditBooking(booking);
    setShowBookingForm(true);
  };

  const handleAddBooking = () => {
    setEditBooking(null);
    setShowBookingForm(true);
  };

  const handleBookingFormClose = () => {
    setShowBookingForm(false);
    setEditBooking(null);
    fetchBookings();
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setIsViewModalOpen(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Booking History</h2>

      {/* Search, Filter, and Action Buttons Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or service..."
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
          <option value="confirmed">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={handleAddBooking}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white-default rounded-lg hover:bg-green-600"
        >
          <Plus size={20} />
          Add Booking
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white-default text-left text-sm text-gray-500">
          <thead className="bg-green-200 text-gray-700 text-xs uppercase">
            <tr>
            <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Provider</th>
              <th className="px-6 py-3">Service</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
              <th className="px-6 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr
                key={booking._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white-default"
                } border-b hover:bg-gray-100`}
              >
                <td className="px-6 py-4">{booking.user.name}</td>
                <td className="px-6 py-4">{booking.provider.name}</td>
                <td className="px-6 py-4">{booking.provider.services}</td>
                <td className="px-6 py-4">
                  {new Date(booking.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'completed'
                        ? "bg-green-100 text-green-800"
                        : booking.status === 'cancelled'
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => handleEditBooking(booking)}
                    className="flex items-center gap-2 py-1 px-4 rounded text-white-default bg-blue-500 hover:bg-blue-600"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleModalOpen(booking)}
                    className="py-1 px-4 rounded text-white-default bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </button>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete the booking for ${selectedBooking?.user?.name}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Add/Edit Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          booking={editBooking}
          onClose={handleBookingFormClose}
          isOpen={showBookingForm}
        />
      )}

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
                  <h4 className="font-semibold text-lg mb-4 text-gray-900">
                    Booking Information
                  </h4>
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
                  <h4 className="font-semibold text-lg mb-4 text-gray-900">
                    User Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-black-default">{viewBooking.user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-black-default">{viewBooking.user.email}</p>
                      </div>
                    </div>
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
                        <p className="font-medium text-black-default">{viewBooking.provider.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wrench className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Service</p>
                        <p className="font-medium text-black-default">{viewBooking.provider.services}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 text-gray-900">
                    Status
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(viewBooking.status)}`}>
                    {viewBooking.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;