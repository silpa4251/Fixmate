import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Edit, Eye } from "lucide-react"; // Import Eye icon for "View"
import Modal from "../Modal";
import ProviderForm from "./ProviderForm";

const AllProviders = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [actionType, setActionType] = useState("");
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [editProvider, setEditProvider] = useState(null);
  const navigate = useNavigate();

  // Fetch providers on component mount
  useEffect(() => {
    fetchProviders();
  }, []);

  // Filter providers when search term or filter status changes
  useEffect(() => {
    filterProviders();
  }, [providers, searchTerm, filterStatus]);

  // Fetch all providers from the API
  const fetchProviders = async () => {
    try {
      const response = await axiosInstance.get("/providers");
      if (response.data && Array.isArray(response.data.providers)) {
        setProviders(response.data.providers);
        setFilteredProviders(response.data.providers);
      } else {
        throw new Error("Invalid data format received from the server.");
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch providers.");
      setLoading(false);
    }
  };

  // Filter providers based on search term and status
  const filterProviders = () => {
    let result = [...providers];

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((provider) =>
        filterStatus === "blocked" ? provider.isBlocked : !provider.isBlocked
      );
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (provider) =>
          provider.name?.toLowerCase().includes(searchLower) ||
          provider.email?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProviders(result);
  };

  // Open modal for block/unblock actions
  const handleModalOpen = (provider, type) => {
    setSelectedProvider(provider);
    setActionType(type);
    setModalOpen(true);
  };

  // Handle block/unblock confirmation
  const handleConfirmAction = async () => {
    if (!selectedProvider) return;
    try {
      const endpoint =
        actionType === "block"
          ? "/admin/block-provider"
          : "/admin/unblock-provider";
      const response = await axiosInstance.patch(
        `${endpoint}/${selectedProvider._id}`
      );
      if (response.data.status === "success") {
        setProviders((prevProviders) =>
          prevProviders.map((provider) =>
            provider._id === selectedProvider._id
              ? { ...provider, isBlocked: actionType === "block" }
              : provider
          )
        );
        toast.success(
          response.data.message ||
            `Provider ${actionType === "block" ? "blocked" : "unblocked"} successfully`
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update provider status"
      );
    } finally {
      setModalOpen(false);
      setSelectedProvider(null);
    }
  };

  // Open form to edit a provider
  const handleEditProvider = (provider) => {
    setEditProvider(provider);
    setShowProviderForm(true);
  };

  // Open form to add a new provider
  const handleAddProvider = () => {
    setEditProvider(null);
    setShowProviderForm(true);
  };

  // Close the provider form and refresh data
  const handleProviderFormClose = () => {
    setShowProviderForm(false);
    setEditProvider(null);
    fetchProviders(); // Refresh data after form submission
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Render error state
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Service Providers</h2>

      {/* Search, Filter, and Action Buttons Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black-default"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white-default text-black-default"
        >
          <option value="all">All Providers</option>
          <option value="active">Active Providers</option>
          <option value="blocked">Blocked Providers</option>
        </select>

        {/* Add Provider Button */}
        <button
          onClick={handleAddProvider}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white-default rounded-lg hover:bg-green-600"
        >
          <UserPlus size={20} />
          Add Provider
        </button>
      </div>

      {/* Providers Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white-default text-left text-sm text-gray-500">
          <thead className="bg-green-200 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Service</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">Charge</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
              <th className="px-6 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <tr key={provider._id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-gray-800">{provider.name}</td>
                  <td className="px-6 py-4">{provider.services?.join(", ")}</td>
                  <td className="px-6 py-4">
                    {provider.address[0]?.place || "N/A"}
                  </td>
                  <td className="px-6 py-4">{provider.charge || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        provider.isBlocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {provider.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() =>
                        handleModalOpen(
                          provider,
                          provider.isBlocked ? "unblock" : "block"
                        )
                      }
                      className={`py-1 px-3 rounded text-white-default ${
                        provider.isBlocked
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {provider.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => handleEditProvider(provider)}
                      className="flex items-center gap-2 py-1 px-3 rounded text-white-default bg-blue-500 hover:bg-blue-600"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    </td>
                    <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/admin/providers/${provider._id}`)}
                      className="bg-green-500 text-white-default py-1 px-4 rounded hover:bg-green-600"
                    >
                     View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No providers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Block/Unblock Confirmation */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            actionType === "block"
              ? "Confirm Block Provider"
              : "Confirm Unblock Provider"
          }
          onConfirm={handleConfirmAction}
        >
          <p>
            Are you sure you want to{" "}
            <strong>{actionType === "block" ? "block" : "unblock"}</strong> this
            provider?
          </p>
        </Modal>
      )}

      {/* Provider Form Modal */}
      {showProviderForm && (
        <ProviderForm
          isOpen={showProviderForm}
          onClose={handleProviderFormClose}
          provider={editProvider}
        />
      )}
    </div>
  );
};

export default AllProviders;