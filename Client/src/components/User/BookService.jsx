import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axiosInstance from '../../api/axiosInstance';
import UserNavbar from '../Navbar/UserNavbar';

const BookService = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [status, setStatus] = useState('loading');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch provider details and feedback on mount
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const res = await axiosInstance.get(`/providers/${id}`);
        console.log("proId", res.data.provider);
        setProvider(res.data.provider);
        setStatus('success');
      } catch (error) {
        console.error('Error fetching provider details:', error);
        setStatus('error');
      }
    };

    // const fetchFeedbacks = async () => {
    //   try {
    //     const { data } = await axiosInstance.get(`/feedbacks/${id}`);
    //     setFeedbacks(data);
    //   } catch (error) {
    //     console.error('Error fetching feedbacks:', error);
    //   }
    // };

    fetchProviderData();
    // fetchFeedbacks();
  }, [id]);

  // Fetch available time slots whenever the date changes
  // useEffect(() => {
  //   const fetchTimeSlots = async () => {
  //     try {
  //       const date = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  //       const { data } = await axiosInstance.get(`/time-slots/${id}?date=${date}`);
  //       setTimeSlots(data);
  //     } catch (error) {
  //       console.error('Error fetching time slots:', error);
  //     }
  //   };

  //   if (selectedDate) {
  //     fetchTimeSlots();
  //   }
  // }, [selectedDate, id]);

  // Handle booking submission
  const handleBookNow = async () => {
    try {
      await axiosInstance.post('/users/book', {
        id,
        date: selectedDate.toISOString().split('T')[0],
        slot: selectedSlot,
      });
      alert('Booking successful!');
      setSelectedSlot(null); // Reset selected slot
    } catch (error) {
      alert('Booking failed. Please try again.');
      console.error('Error booking slot:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!provider) {
    return <div>No provider details available</div>;
  }

  return (
    <>
    <UserNavbar />
    <div className="container mx-auto p-4 mt-20">
      {/* Provider Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{provider.name}</h1>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Service:</span> {provider.services}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Address:</span> {provider.address[0].place}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Charge(hour):</span> {provider.charge}
        </p>
        {/* <div className="flex items-center mb-4">
          <span className="text-yellow-500">{"★".repeat(provider.rating)}</span>
          <span className="text-sm text-gray-600 ml-2">({provider.rating})</span>
        </div> */}
      </div>

      {/* Booking Calendar Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Book a Slot</h2>
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

          {/* Time Slots */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Available Slots</h3>
            <div className="grid grid-cols-2 gap-4">
              {timeSlots.map((slot, index) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          disabled={!selectedSlot}
          onClick={handleBookNow}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg mt-6 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Book Now
        </button>
      </div>

      {/* Feedback Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Feedback</h2>
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">
                  {'★'.repeat(feedback.rating)}
                  {'☆'.repeat(5 - feedback.rating)}
                </span>
                <span className="text-sm text-gray-600 ml-2">by {feedback.user}</span>
              </div>
              <p className="text-gray-700">{feedback.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default BookService;
