import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const BookingForm = ({ booking, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    providerName: "",
    providerEmail: "",
    service: "",
    startDate: "",
    endDate: "",
    status: "pending"
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        userName: booking.user.name,
        userEmail: booking.user.email,
        providerName: booking.provider.name,
        providerEmail: booking.provider.email,
        service: booking.provider.services,
        startDate: new Date(booking.startDate).toISOString().split('T')[0],
        endDate: new Date(booking.endDate).toISOString().split('T')[0],
        status: booking.status
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        user: {
          name: formData.userName,
          email: formData.userEmail,
        },
        provider: {
          name: formData.providerName,
          email: formData.providerEmail,
          services: formData.service,
        },
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      };

      if (booking) {
        await axiosInstance.patch(`/admin/bookings/${booking._id}/edit`, bookingData);
        toast.success("Booking updated successfully");
      } else {
        await axiosInstance.post("/admin/bookings", bookingData);
        toast.success("Booking created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save booking");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-default bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white-default rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {booking ? "Edit Booking" : "Add New Booking"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">User Details</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full text-black-default rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    required
                    className="mt-1 block text-black-default w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Provider Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Provider Details</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Provider Name</label>
                  <input
                    type="text"
                    name="providerName"
                    value={formData.providerName}
                    onChange={handleChange}
                    required
                    className="mt-1 text-black-default block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Provider Email</label>
                  <input
                    type="email"
                    name="providerEmail"
                    value={formData.providerEmail}
                    onChange={handleChange}
                    required
                    className="mt-1 text-black-default block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service</label>
                  <input
                    type="text"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="mt-1 text-black-default block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Booking Details</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="mt-1 text-black-default block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="mt-1 text-black-default block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 text-black-default block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "Saving..." : booking ? "Update Booking" : "Create Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;