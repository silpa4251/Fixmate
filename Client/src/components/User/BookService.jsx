import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch } from 'react-redux';
import { createBooking } from '../../redux/slices/bookingSlice';
import axiosInstance from '../../api/axiosInstance';
import UserNavbar from '../Navbar/UserNavbar';

const BookService = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // State variables
  const [provider, setProvider] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [status, setStatus] = useState('loading');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingSection, setShowBookingSection] = useState(false); // Toggle for booking section

  // Fetch provider details
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const res = await axiosInstance.get(`/providers/${id}`);
        setProvider(res.data.provider);
        setStatus('success');
      } catch (error) {
        console.error('Error fetching provider details:', error);
        setStatus('error');
      }
    };
    fetchProviderData();
  }, [id]);

  // Fetch available time slots for the selected date
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        // Construct the date string in YYYY-MM-DD format
        const localDate = `${year}-${month}-${day}`;
        const response = await axiosInstance.get(
          `/bookings/available-slots?providerId=${id}&date=${localDate}`
        );
        setTimeSlots(response.data.availableSlots || []);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        setTimeSlots([]);
      }
    };
    fetchTimeSlots();
  }, [selectedDate, id]);

  // Handle booking logic
  const handleBookNow = async () => {
    if (!selectedSlot) {
      return alert('Please select a time slot to proceed.');
    }
    try {
      await dispatch(
        createBooking({
          providerId: id,
          date: selectedDate.toISOString().split('T')[0],
          slot: selectedSlot,
        })
      ).unwrap();
      alert('Booking successful!');
      setSelectedSlot(null); // Reset the selected slot after booking
    } catch (error) {
      alert(error.message || 'Booking failed. Please try again.');
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  // Error or no provider found
  if (status === 'error' || !provider) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-semibold text-red-500">
          No provider details available.
        </p>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="container mx-auto p-4 mt-20">
        {/* Provider Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
    <img
      src={provider.image || "https://via.placeholder.com/500"}
      alt={provider.name}
      className="w-full h-60 object-cover rounded-lg"
    />
  </div> 
  <div className="w-full md:w-2/3">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {provider.name}
          </h1>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Service:</span> {provider.services}
          </p>
          <p className="text-gray-600 mb-2">
      <span className="font-medium">Description:</span>{" "}
      {provider.description || "No description available."}
    </p>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Address:</span>{' '}
            {provider.address[0]?.place || 'N/A'}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Charge (hour):</span> {provider.charge}
          </p>
        </div>
        </div>

        {/* Book Now Button */}
        <button
          onClick={() => setShowBookingSection(!showBookingSection)} // Toggle booking section
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
        >
          {showBookingSection ? 'Hide Booking Options' : 'Show Booking Options'}
        </button>

        {/* Booking Section (Conditionally Rendered) */}
        {showBookingSection && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Book a Slot
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  minDate={new Date()}
                  className="border rounded-lg shadow-sm"
                />
              </div>

              {/* Available Time Slots */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Available Slots
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {timeSlots.length > 0 ? (
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
                    <p className="text-gray-500">No slots available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              disabled={!selectedSlot}
              onClick={handleBookNow}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg mt-6 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BookService;