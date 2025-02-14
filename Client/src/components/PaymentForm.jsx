import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const PaymentForm = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Step 1: Create an order on the backend
      const response = await axiosInstance.post("/users/make-payment", {
        amount: 1000, // ₹100.00 (amount in rupees)
        currency: "INR",
      });

      const { id: orderId, amount, currency } = response.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use your Razorpay Key ID
        amount: amount, // Amount in paise (Razorpay expects amount in paise)
        currency: currency,
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: orderId, // Pass the order ID from the backend
        handler: async function (response) {
          // Handle successful payment
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          // Step 3: Verify the payment on the backend
          try {
            const verifyResponse = await axiosInstance.post("/users/verify-payment", {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            });

            if (verifyResponse.data.status === "success") {
              toast.success("Payment successful! Response:", verifyResponse.data);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Failed to verify payment. Please try again.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Make Payment</h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentForm;