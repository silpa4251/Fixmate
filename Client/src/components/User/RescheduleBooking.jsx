import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const RescheduleBooking = () => {
  const { bookingId } = useParams();
  const [selectedDates, setSelectedDates] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Format date for backend
  const formatDateForBackend = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        setBookingDetails(response.data.booking);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        alert('Failed to load booking details. Please try again.');
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  // Handle Reschedule
  const handleReschedule = async () => {
    if (selectedDates.length === 0) {
      setError('Please select valid dates for rescheduling.');
      return;
    }

    const startDate = selectedDates[0];
    const endDate = selectedDates[selectedDates.length - 1];

    try {
      await axiosInstance.patch(`/bookings/${bookingId}/reschedule`, {
        startDate: formatDateForBackend(startDate),
        endDate: formatDateForBackend(endDate),
      });
      toast.success('Booking rescheduled successfully!');
      navigate('/bookings');
    } catch (err) {
      console.error('Error rescheduling booking:', err);
      setError('Failed to reschedule booking. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Reschedule Booking
        </h1>

        {/* Provider Details Card */}
        {bookingDetails && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex items-center gap-4">
            <img
              src={bookingDetails.providerId.image || 'https://via.placeholder.com/100'}
              alt={bookingDetails.providerId.name}
              className="w-20 h-20 rounded-full object-cover shadow-md"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{bookingDetails.providerId.name}</h2>
              <p className="text-gray-600">{bookingDetails.providerId.services}</p>
              <p className="text-gray-500">{bookingDetails.providerId.address[0]?.place || 'N/A'}</p>
            </div>
          </div>
        )}

        <div className="bg-white-default p-6 rounded-lg shadow-md">
          <div className="mb-6 calendar-container">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Select New Dates</h3>
            <Calendar
              onChange={(range) => {
                if (!range || !Array.isArray(range)) {
                  setSelectedDates([]);
                  return;
                }
                if (range.length === 1) {
                  setSelectedDates([range[0]]);
                } else {
                  setSelectedDates(range);
                }
              }}
              value={selectedDates.length > 0 ? [selectedDates[0], selectedDates[selectedDates.length - 1]] : null}
              minDate={new Date()}
              // className="border rounded-lg shadow-sm"
              selectRange={true}
              // tileDisabled={tileDisabled}
              // tileClassName={tileClassName}
            />
          </div>

          {/* Display Selected Dates */}
          {selectedDates.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Dates:</h3>
              <ul className="list-disc list-inside">
                {selectedDates.map((date, index) => (
                  <li key={index}>{formatDateForBackend(date)}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleReschedule}
            disabled={selectedDates.length === 0 || loading}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default RescheduleBooking;