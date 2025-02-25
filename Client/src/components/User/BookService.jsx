import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch } from 'react-redux';
import { createBooking } from '../../redux/slices/bookingSlice';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Star, MapPin, DollarSign, Briefcase, Calendar as CalendarIcon, Clock } from 'lucide-react';

const BookService = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [status, setStatus] = useState('loading');
  const [selectedDates, setSelectedDates] = useState([]);
  const [showBookingSection, setShowBookingSection] = useState(false);
  const [bookedDates, setBookedDates] = useState([]); 
  const [feedbacks, setFeedbacks] = useState([]); 
  const [averageRating, setAverageRating] = useState(0);

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
        const [providerRes, bookingsRes, feedbackRes, averageRatingRes ] = await Promise.all([
          axiosInstance.get(`/providers/${id}`),
          axiosInstance.get(`/bookings/provider/${id}/booked-dates`),
          axiosInstance.get(`/ratings/provider/${id}`),
          axiosInstance.get(`/ratings/provider/${id}/average`)
        ]);
        console.log("y56",feedbackRes)
        console.log("y56",averageRatingRes)
        setProvider(providerRes.data.provider);
        setFeedbacks(feedbackRes.data.feedbacks);
        setAverageRating(averageRatingRes.data.averageRating);
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
    <div className="min-h-screen py-8 mt-20 ">
    <div className="container mx-auto px-4 max-w-6xl">
      {/* Provider Details Card */}
      <div className="bg-white-default rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="relative h-56 rounded-lg overflow-hidden">
              <img
                src={provider.image || "https://via.placeholder.com/500"}
                alt={provider.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="md:w-2/3 space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {provider.name}
            </h1>
            
            <div className="flex items-center gap-2 bg-green-500 w-fit px-2 py-0.5 rounded-full">
              <span className="text-white-default font-semibold">
                {averageRating.toFixed(1)}
              </span>
              <Star className="w-5 h-5 text-white-default" fill="currentColor" />
            </div>

            <div className="grid text-gray-600">
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span>{provider.services}</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>{provider.address[0]?.place || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-600">{provider.charge}</span>
                <span className="text-gray-500">per day</span>
              </div>
            </div>
          </div>
        </div>
      </div>

            {/* Feedback Section */}
        <div className="bg-white-default rounded-xl shadow-lg p-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
        
        {feedbacks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No reviews available yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {feedbacks.map((feedback, index) => (
              <div key={index} className="p-2 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                    <span className="font-semibold text-gray-800">{feedback.rating}/5</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-600">{feedback.comment || 'No comment provided.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => setShowBookingSection(!showBookingSection)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
        >
          <CalendarIcon className="w-5 h-5" />
          {showBookingSection ? 'Hide Booking Calendar' : 'Show Booking Calendar'}
        </button>
      </div>

      {/* Booking Section */}
      {showBookingSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-500" />
            Select Your Dates
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="calendar-container">
              <Calendar
                onChange={handleDateChange}
                value={selectedDates.length > 0 ? [selectedDates[0], selectedDates[selectedDates.length - 1]] : null}
                minDate={new Date()}
                selectRange={true}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                className="w-full shadow-md rounded-lg"
              />
            </div>

            {selectedDates.length > 0 && (
              <div className="bg-white-default p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Selected Dates
                </h3>
                <div className="space-y-2">
                  {selectedDates.map((date, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600 bg-white p-2 rounded">
                      <CalendarIcon className="w-4 h-4 text-blue-500" />
                      {formatDateForBackend(date)}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button
                    disabled={selectedDates.length === 0}
                    onClick={handleBookNow}
                    className="w-full bg-green-600 text-white-default py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300 shadow hover:shadow-lg"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  </div>
);
};


export default BookService;