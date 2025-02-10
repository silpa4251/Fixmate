import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ViewUsers = () => {
    const { id } = useParams();
    console.log("first",id)
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details and their bookings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user details
        const userResponse = await axiosInstance.get(`/admin/users/${id}`);
        setUser(userResponse.data.data.data.user);
        
        // Fetch user bookings
        const bookingsResponse = await axiosInstance.get(`/admin/bookings/user/${id}`);
        setBookings(bookingsResponse.data.bookings);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user details.");
        setLoading(false);
        toast.error(err.response?.data?.message || "An error occurred while fetching data.");
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center text-green-500 hover:text-green-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Users List
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Details</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <img
              src={user.profilePic || "https://via.placeholder.com/150"}
              alt={`${user.name}'s profile`}
              className="w-32 h-32 rounded-full object-cover border-2 border-green-500"
            />
          </div>
          {/* Personal Details */}
          <div className="flex-grow">
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Phone:</span> {user.phone || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Address:</span>{" "}
              {user.address?.[0]?.place || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Joined On:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
              >
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">User Bookings</h2>
        {bookings.length > 0 ? (
          <table className="min-w-full bg-white text-left text-sm text-gray-500">
            <thead className="bg-green-200 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Provider</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white-default"
                  } border-b hover:bg-gray-100`}
                >
                  <td className="px-6 py-4">{booking.providerId?.name || "N/A"}</td>
                  <td className="px-6 py-4">{booking.providerId?.services || "N/A"}</td>
                  <td className="px-6 py-4">{booking.date}</td>
                  <td className="px-6 py-4">{booking.slot}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No bookings found for this user.</p>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;