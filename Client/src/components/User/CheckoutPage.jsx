import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../api/axiosInstance";

const CheckoutPage = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const FIXED_AMOUNT = 100;
  const navigate = useNavigate();
  const { bookingId } = useParams();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        if (response.data.status === "success") {
          setBookingDetails(response.data.booking);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setLoading(false);
        toast.error("Failed to fetch booking details", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!bookingDetails) {
      toast.error("Booking details are not available", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/users/make-payment", {
        amount: FIXED_AMOUNT * 100,
        currency: "INR",
        bookingId: bookingId 
      });

      const { id: orderId, amount, currency } = response.data;

      await loadRazorpayScript();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Fixmate",
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
              await axiosInstance.patch(`/bookings/${bookingId}/status`,{status: "confirmed"});
              toast.success("Payment processed successfully!", {
                position: "bottom-right",
                autoClose: 3000,
                onClose: () => navigate("/home"),
              });
            } else {
              toast.error("Payment verification failed", {
                position: "bottom-right",
                autoClose: 3000,
              });
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Failed to verify payment. Please try again", {
              position: "bottom-right",
              autoClose: 3000,
            });
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
      toast.error("An error occurred. Please try again", {
        position: "bottom-right",
        autoClose: 3000,
      });
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

        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <h2 className="font-semibold mb-4">Payment Details</h2>
          <div className="flex justify-between mb-2">
            <span>Booking Fee</span>
            <span>₹{FIXED_AMOUNT}</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Service Tax</span>
            <span>₹0</span>
          </div>
          <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
            <span>Total Amount</span>
            <span>₹{FIXED_AMOUNT}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Pay Now (₹{FIXED_AMOUNT})
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;