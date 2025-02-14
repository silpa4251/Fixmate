import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch } from 'react-redux';
import { createBooking } from '../../redux/slices/bookingSlice';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const BookService = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [status, setStatus] = useState('loading');
  const [selectedDates, setSelectedDates] = useState([]);
  const [showBookingSection, setShowBookingSection] = useState(false);
  const [bookedDates, setBookedDates] = useState([]); // New state for booked dates

  // Format date for backend
  const formatDateForBackend = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Parse date string from backend
  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Fetch provider details and booked dates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providerRes, bookingsRes] = await Promise.all([
          axiosInstance.get(`/providers/${id}`),
          axiosInstance.get(`/bookings/provider/${id}/booked-dates`)
        ]);
        setProvider(providerRes.data.provider);
        // Assuming the API returns an array of date strings in 'YYYY-MM-DD' format
        setBookedDates(bookingsRes.data.bookedDates.map(dateStr => parseDate(dateStr)));
        setStatus('success');
      } catch (error) {
        console.error('Error fetching data:', error);
        setStatus('error');
      }
    };
    fetchData();
  }, [id]);

  const checkDateAvailability = async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get(`/bookings/check-availability`, {
        params: {
          providerId: id,
          startDate: formatDateForBackend(startDate),
          endDate: formatDateForBackend(endDate)
        }
      });
      return response.data.isAvailable;
    } catch (error) {
      console.error('Error checking date availability:', error);
      toast.error('Failed to check date availability');
      return false;
    }
  };

  // Check if a date is booked
  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate => 
      date.getFullYear() === bookedDate.getFullYear() &&
      date.getMonth() === bookedDate.getMonth() &&
      date.getDate() === bookedDate.getDate()
    );
  };

  // Calendar tile disable function
  const tileDisabled = ({ date }) => {
    // Disable past dates
    if (date < new Date().setHours(0, 0, 0, 0)) {
      return true;
    }
    // Disable booked dates
    return isDateBooked(date);
  };

  const tileClassName = ({ date }) => {
    // Style for past dates
    if (date < new Date().setHours(0, 0, 0, 0)) {
      return "date-disabled"; // Grayed-out past dates
    }
    // Style for booked dates
    if (isDateBooked(date)) {
      return "date-booked"; // Red background for booked dates
    }
    // Default style
    return null;
  };

  // Modified date selection handler
  const handleDateChange = (range) => {
    if (!range || !Array.isArray(range)) {
      setSelectedDates([]);
      return;
    }

    if (range.length === 1) {
      const selectedDate = new Date(range[0].setHours(0, 0, 0, 0));
      if (isDateBooked(selectedDate)) {
        toast.error('The selected date is already booked. Please choose a different date.');
        setSelectedDates([]);
      } else {
        setSelectedDates([selectedDate]);
      }
      return;
    }

    const [start, end] = range;
    if (!start || !end) {
      setSelectedDates([]);
      return;
    }
  
    const dateArray = [];
    const startDate = new Date(start.setHours(0, 0, 0, 0));
    const endDate = new Date(end.setHours(0, 0, 0, 0));
    let currentDate = startDate;
  
    // Check if any date in the range is booked
    let hasBookedDate = false;
    while (currentDate <= endDate) {
      if (isDateBooked(currentDate)) {
        hasBookedDate = true;
        break;
      }
      dateArray.push(new Date(currentDate));
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    if (hasBookedDate) {
      toast.error('Your selection includes already booked dates. Please select different dates.');
      setSelectedDates([]);
    } else {
      setSelectedDates(dateArray);
    }
  };

  // Modified booking logic for multiple dates
  const handleBookNow = async () => {
    if (selectedDates.length === 0) {
      toast.warning('Please select dates for booking.');
      return;
    }
    const startDate = selectedDates[0];
    const endDate = selectedDates[selectedDates.length - 1];
  
    const isAvailable = await checkDateAvailability(startDate, endDate);
  
    if (!isAvailable) {
      toast.error('Selected dates are not available. Please choose different dates.');
      return;
    }
  
  

    try {
      // Create bookings for all selected dates
      const result = await dispatch(
        createBooking({
          providerId: id,
          startDate: formatDateForBackend(startDate),
          endDate: formatDateForBackend(endDate),
          numberOfDays: selectedDates.length
        })
      ).unwrap();

      if (result && result.booking && result.booking._id) {
        navigate(`/checkout/${result.booking._id}`);
      } else {
        toast.error('Booking ID not received from server');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Booking failed. Please try again.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

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
    <div className="container mx-auto p-4 mt-20">
      {/* Provider Details Section */}
      <div className="bg-white-default p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-6">
        <div>
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
          {/* <p className="text-gray-600 mb-2">
            <span className="font-medium">Description:</span>{" "}
            {provider.description || "No description available."}
          </p> */}
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Address:</span>{' '}
            {provider.address[0]?.place || 'N/A'}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Charge (per day):</span> {provider.charge}
          </p>
        </div>
      </div>
      
      <div className='flex justify-center'>
      <button
        onClick={() => setShowBookingSection(!showBookingSection)}
        className="bg-green-500 text-white-default py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
      >
        {showBookingSection ? 'Hide Booking Options' : 'Show Booking Options'}
      </button>
      </div>

      {showBookingSection && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Booking Dates
          </h2>
          
          <div className="space-y-6 grid grid-cols-2">
            {/* Calendar with multi-date selection */}
            <div className="max-w-md mx-auto calendar-container mt-4">
            <Calendar
                onChange={handleDateChange}
                value={selectedDates.length > 0 ? [selectedDates[0], selectedDates[selectedDates.length - 1]] : null}
                minDate={new Date()}
                // className="border rounded-lg shadow-sm w-full"
                selectRange={true}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
              />
            </div>

            {/* Selected Dates Summary */}
            {selectedDates.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Selected Dates:
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-1">
                    {selectedDates.map((date, index) => (
                      <li key={index} className="text-gray-600">
                        {formatDateForBackend(date)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}


          </div>
            <div className='flex justify-center'>
            <button
              disabled={selectedDates.length === 0}
              onClick={handleBookNow}
              className="bg-green-500 text-white-default py-2 px-6 rounded-lg mt-6 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
            >
              Confirm Booking 
            </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default BookService;