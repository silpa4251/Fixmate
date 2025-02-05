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

  // Fetch available slots for the selected date
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const localDate = `${year}-${month}-${day}`;
        const response = await axiosInstance.get(
          `/bookings/available-slots?providerId=${providerId}&date=${localDate}`
        );
        setTimeSlots(response.data.availableSlots || []);
        setLoading(false);
      } catch (error) { 
        console.error('Error fetching time slots:', error);
        setLoading(false);
      }
    };
    fetchTimeSlots();
  }, [selectedDate]);

  // Handle Reschedule
  const handleReschedule = async () => {
    if (!selectedSlot) {
      return alert('Please select a new time slot.');
    }
    try {
      await axiosInstance.patch(`/bookings/${bookingId}/reschedule`, {
        newDate: selectedDate.toISOString().split('T')[0],
        newSlot: selectedSlot,
      });
      alert('Booking rescheduled successfully!');
      window.location.href = '/bookings'; // Redirect back to bookings page
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      alert('Failed to reschedule booking. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Reschedule Booking
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Calendar */}
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Select New Date</h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
              className="border rounded-lg shadow-sm"
            />
          </div>

          {/* Available Time Slots */}
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Available Slots</h3>
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

          {/* Confirm Reschedule Button */}
          <button
            onClick={handleReschedule}
            disabled={!selectedSlot}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleBooking;