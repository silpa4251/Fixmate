import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const AllProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axiosInstance.get("/providers");
        setProviders(response.data.providers);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch providers.");
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  // Handle provider block/unblock
  const handleBlock = async (providerId) => {
    try {
      await axiosInstance.put(`/providers/block/${providerId}`);
      setProviders(providers.map(provider =>
        provider._id === providerId ? { ...provider, isBlocked: !provider.isBlocked } : provider
      ));
      alert("Provider status updated successfully.");
    } catch (err) {
      alert("Failed to update provider status.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Service Providers</h2>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white text-left text-sm text-gray-500">
          <thead className="bg-green-200 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">E-Mail</th>
              <th className="px-6 py-3">Joined Date</th>
              <th className="px-6 py-3">Services</th>
              {/* <th className="px-6 py-3">Address</th> */}
              <th className="px-6 py-3">Actions</th>
              <th className="px-6 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b hover:bg-gray-100`}
              >
                <td className="px-6 py-4 text-gray-800">{provider.name}</td>
                <td className="px-6 py-4">{provider.email}</td>
                <td className="px-6 py-4">{provider.createdAt}</td>
                <td className="px-6 py-4">{provider.services.join(", ")}</td>
                {/* <td className="px-6 py-4">{provider.address[0].place}</td> */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleBlock(provider._id)}
                    className={`py-1 px-4 rounded text-white-default      ${
                      provider.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {provider.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button className="bg-blue-500 text-white-default py-1 px-4 rounded hover:bg-blue-600">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProviders;
