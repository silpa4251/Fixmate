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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-20">
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          My Bookings
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Manage your scheduled services and bookings
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
      )}

      {/* No Bookings Found */}
      {!loading && bookings.length === 0 && (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-sm p-8">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h2>
      <p className="text-gray-500">You haven't made any bookings yet</p>
    </div>
      )}

      {/* Display Bookings */}
      {!loading && bookings.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white-default p-6 rounded-lg shadow-md"
            >
                <div className="flex justify-center mb-4">
    <img
      src={booking.providerId.image}
      alt={booking.providerId.name}
      className="w-20 h-20 rounded-full object-cover shadow-md"
    />
  </div>
  <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800">  {booking.providerId.name}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-sm font-medium">
                      {booking.status}
                    </span>
                  </div>

              <div className="space-y-3">
                    <div className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{booking.providerId.services}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{booking.providerId.address[0]?.place || 'N/A'}</span>
                    </div>

                    <div className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{booking.date}</span>
                    </div>

                    <div className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{booking.slot}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-gray-50 flex gap-3">
                  <button
                    onClick={() => handleReschedule(booking._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg 
                             font-medium transition duration-200 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg 
                             font-medium transition duration-200 focus:outline-none focus:ring-2 
                             focus:ring-red-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;