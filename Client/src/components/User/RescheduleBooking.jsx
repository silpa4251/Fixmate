import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axiosInstance from '../../api/axiosInstance';

const RescheduleBooking = () => {
  const { bookingId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState('');

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        setBookingDetails(response.data.booking);
        setSelectedDate(new Date(response.data.booking.date));
      } catch (err) {
        console.error('Error fetching booking details:', err);
        alert('Failed to load booking details. Please try again.');
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  // Fetch available slots for the selected date
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!bookingDetails) return;

      setLoading(true);
      try {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const localDate = `${year}-${month}-${day}`;
        const response = await axiosInstance.get(
          `/bookings/available-slots?providerId=${bookingDetails.providerId._id}&date=${localDate}`
        );
        setTimeSlots(response.data.availableSlots || []);
      } catch (err) {
        console.error('Error fetching time slots:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeSlots();
  }, [selectedDate, bookingDetails]);

  // Handle Reschedule
  const handleReschedule = async () => {
    if (!selectedSlot) {
      setError('Please select a new time slot.');
      return;
    }

    try {
      const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const localDate = `${year}-${month}-${day}`;
      await axiosInstance.patch(`/bookings/${bookingId}/reschedule`, {
        newDate: localDate,
        newSlot: selectedSlot,
      });

      alert('Booking rescheduled successfully!');
      window.location.href = '/bookings';
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

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Select New Date</h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
              className="border rounded-lg shadow-sm"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Available Slots</h3>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              {loading ? (
                <p className="text-gray-500 col-span-2">Loading slots...</p>
              ) : timeSlots.length > 0 ? (
                timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-lg text-center ${
                      selectedSlot === slot
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 col-span-2">No slots available</p>
              )}
            </div>
          </div>

          <button
            onClick={handleReschedule}
            disabled={!selectedSlot || loading}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleBooking;
