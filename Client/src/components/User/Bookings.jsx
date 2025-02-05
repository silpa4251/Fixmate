import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get('/bookings/user');
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Handle Reschedule
  const handleReschedule = (bookingId) => {
    navigate(`/reschedule/${bookingId}`);
  };

  // Handle Cancel
  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axiosInstance.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' });
        alert('Booking cancelled successfully!');
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Bookings</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <p className="text-2xl font-semibold text-gray-600">Loading...</p>
        </div>
      )}

      {/* No Bookings Found */}
      {!loading && bookings.length === 0 && (
        <div className="flex items-center justify-center h-screen">
          <p className="text-2xl font-semibold text-gray-500">No bookings found.</p>
        </div>
      )}

      {/* Display Bookings */}
      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">{booking.providerId.name}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Service:</span> {booking.providerId.services}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Address:</span> {booking.providerId.address[0]?.place || 'N/A'}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Date:</span> {booking.date}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Time:</span> {booking.slot}
              </p>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => handleReschedule(booking._id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;