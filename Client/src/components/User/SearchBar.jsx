/* eslint-disable react/prop-types */
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
        placeholder="Search for a service like Plumber, Electrician..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full text-black-default p-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="px-4 py-2 bg-green-button text-white-default rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400"
      >
        {loading ? "Searching..." : "Search"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default SearchBar;
