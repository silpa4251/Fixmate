import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const SearchBar = ({ setServiceProviders }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/providers/search", {
        params: { service: searchTerm.trim() },
      });
      setServiceProviders(response.data.providers);
    } catch (err) {
      setError("Failed to fetch service providers. Try again.");
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 p-4">
      <input
        type="text"
        placeholder="Search for a service (e.g., 'Plumber')..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full text-black-default p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Searching..." : "Search"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default SearchBar;
