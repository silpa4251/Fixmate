import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { toast } from "react-toastify";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalType, setModalType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get("/bookings/user");
        setBookings(response.data.bookings);
      } catch (error) {
        toast.error("Error fetching bookings. Please try again.");
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const status = booking.status.toLowerCase();
    switch (activeTab) {
      case "Upcoming":
        return status === "pending" || status === "confirmed";
      case "Completed":
        return status === "completed";
      case "Canceled":
        return status === "cancelled";
      default:
        return true;
    }
  });

  const handleReschedule = (booking) => {
    if (["completed", "cancelled"].includes(booking.status.toLowerCase())) {
      toast.error("This booking cannot be rescheduled.");
      return;
    }
    setSelectedBooking(booking);
    setModalType("reschedule");
    setModalOpen(true);
  };

  const handleCancel = (booking) => {
    if (booking.status.toLowerCase() === "completed") {
      toast.error("This booking cannot be canceled.");
      return;
    }
    setSelectedBooking(booking);
    setModalType("cancel");
    setModalOpen(true);
  };

  const confirmReschedule = () => {
    if (!selectedBooking?._id) return;
    navigate(`/reschedule/${selectedBooking._id}`);
    setModalOpen(false);
  };

  const confirmCancel = async () => {
    if (!selectedBooking?._id) return;
    try {
      await axiosInstance.patch(`/bookings/${selectedBooking._id}/status`, {
        status: "cancelled",
      });
      toast.success("Booking cancelled successfully!");
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === selectedBooking._id
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-green-200 py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            My Bookings
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your scheduled services and bookings
          </p>
        </div>

        <div className="flex justify-center mb-6">
          {["Upcoming", "Completed", "Canceled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 mx-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
        )}

        {!loading && filteredBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-sm p-8">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Bookings Found
            </h2>
            <p className="text-gray-500">
              You haven&apos;t made any bookings yet
            </p>
          </div>
        )}

        {!loading && filteredBookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={booking.providerId?.image}
                    alt={booking.providerId?.name || "Provider"}
                    className="w-20 h-20 rounded-full object-cover shadow-md"
                  />
                </div>

                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      {booking.providerId?.name || "Provider"}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status.toLowerCase() === "confirmed"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-800"
                          : booking.status.toLowerCase() === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-gray-600">
                      <svg
                        className="w-5 h-5 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{booking.providerId?.services || "N/A"}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <svg
                        className="w-5 h-5 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>
                        {booking.providerId?.address?.[0]?.place || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-gray-600">
                      <svg
                        className="w-5 h-5 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(booking.startDate).toLocaleDateString() ===
                        new Date(booking.endDate).toLocaleDateString()
                          ? new Date(booking.startDate).toLocaleDateString()
                          : `${new Date(
                              booking.startDate
                            ).toLocaleDateString()} - ${new Date(
                              booking.endDate
                            ).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex gap-3">
                  <button
                    onClick={() => handleReschedule(booking)}
                    disabled={["completed", "cancelled"].includes(
                      booking.status.toLowerCase()
                    )}
                    className={`flex-1 ${
                      ["completed", "cancelled"].includes(
                        booking.status.toLowerCase()
                      )
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white py-2.5 px-4 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(booking)}
                    disabled={["completed", "cancelled"].includes(
                      booking.status.toLowerCase()
                    )}
                    className={`flex-1 ${
                      ["completed", "cancelled"].includes(
                        booking.status.toLowerCase()
                      )
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white py-2.5 px-4 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={modalType === "cancel" ? confirmCancel : confirmReschedule}
          title={
            modalType === "cancel" ? "Cancel Booking" : "Reschedule Booking"
          }
          message={
            modalType === "cancel"
              ? "Are you sure you want to cancel this booking? You may not get a refund"
              : "Do you want to reschedule this booking?"
          }
          confirmText={
            modalType === "cancel" ? "Yes, Cancel" : "Yes, Reschedule"
          }
          cancelText="No, Go Back"
        />
      </div>
    </div>
  );
};

export default Bookings;
