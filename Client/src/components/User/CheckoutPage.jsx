import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useParams } from "react-router-dom";

const CheckoutPage = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const { bookingId } = useParams(); // Get bookingId from URL params

  // Fetch booking details using bookingId
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        if (response.data.status === "success") {
          setBookingDetails(response.data.booking);
          calculateTotalAmount(response.data.booking);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  // Calculate total bill amount
  const calculateTotalAmount = (booking) => {
    const baseCharge = booking.providerId.charge || 0;
    const taxRate = 0.1; // 10% tax
    const tax = baseCharge * taxRate;
    const total = baseCharge + tax;
    setTotalAmount(total);
  };

  // Dynamically load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  };

  // Handle payment
  const handlePayment = async () => {
    if (!bookingDetails) {
      alert("Booking details are not available.");
      return;
    }

    try {
      const response = await axiosInstance.post("/users/make-payment", {
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: "INR",
      });

      const { id: orderId, amount, currency } = response.data;

      await loadRazorpayScript();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Your Company Name",
        description: "Booking Payment",
        order_id: orderId,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          try {
            const verifyResponse = await axiosInstance.post("/users/verify-payment", {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            });

            if (verifyResponse.data.status === "success") {
              alert("Payment successful!");
            } else {
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Failed to verify payment. Please try again.");
          }
        },
        prefill: {
          name: bookingDetails.userId.name || "Customer Name",
          email: bookingDetails.userId.email || "customer@example.com",
          contact: bookingDetails.userId.phone || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!bookingDetails) {
    return <div className="text-center mt-20">No booking details available.</div>;
  }

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-xl font-bold text-center mb-6">Booking Details</h1>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center gap-4">
        <img
            src={bookingDetails.providerId.image}
            alt={bookingDetails.providerId.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
          <p className="text-gray-600 mb-2">
          <span className="font-medium">Name:</span> {bookingDetails.providerId.name}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Service:</span> {bookingDetails.providerId.services}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Date:</span> {bookingDetails.date}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Time:</span> {bookingDetails.slot}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Address:</span> {bookingDetails.providerId.address?.[0]?.place || "N/A"}
        </p>
      </div>
      </div>

      {/* Bill Section */}
      <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <h2 className="font-semibold mb-4">Payment Details</h2>
          <div className="flex justify-between mb-2">
          <span>Booking Fee</span>
          <span>₹{bookingDetails.providerId.charge}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-2">
          <span> Service Tax</span>
          <span>₹0</span>
        </div>
        <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
          <span>Total Amount</span>
          <span>₹{bookingDetails.providerId.charge}</span>
        </div>
      </div>

      {/* Pay Now Button */}
      <button
        onClick={handlePayment}
        className="w-full bg-green-500 text-white-default py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Pay Now (₹{totalAmount.toFixed(2)})
      </button>
    </div>
    </div>
  );
};

export default CheckoutPage;