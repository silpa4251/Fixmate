import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { MapPin, Mail, Phone, Calendar, Clock } from "lucide-react";

const ViewProvider = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        setLoading(true);
        const [providerRes, bookingsRes] = await Promise.all([
          axiosInstance.get(`/providers/${id}`),
          axiosInstance.get(`/admin/bookings/provider/${id}`)
        ]);
        setProvider(providerRes.data.provider);
        setBookings(bookingsRes.data.bookings);
      } catch (err) {
        setError("Failed to fetch provider details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!provider) return <div className="p-4">Provider not found</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Provider Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Image */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-48 h-48 rounded-full overflow-hidden">
              {provider.profileImage ? (
                <img
                  src={provider.profileImage}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${
                provider.isBlocked ? 'bg-red-500' : 'bg-green-500'
              }`} />
            </div>
          </div>

          {/* Provider Details */}
          <div className="col-span-2">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{provider.name}</h1>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2" />
                <span>{provider.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2" />
                <span>{provider.phone || 'No phone number'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{provider.address?.[0]?.place || 'No address'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Joined: {new Date(provider.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Services */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {provider.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Booking History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white-default text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service Location</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{booking.userId.name}</td>
                    <td className="px-6 py-4">{booking.userId.address[0].place}</td>
                    <td className="px-6 py-4">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{booking.slot}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewProvider;