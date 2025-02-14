import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Edit } from "lucide-react";
import Modal from "../Modal";
import UserForm from "./UserForm";
import useDebounce from "../../hooks/useDebounce";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(6);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, limit]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterStatus]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/admin/users", {
        params: { page: currentPage, limit },
      });
      setUsers(response.data.data.users);
      setFilteredUsers(response.data.data.users);
      setTotalPages(response.data.data.pagination.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];

    if (filterStatus !== "all") {
      result = result.filter(user => {
        if (filterStatus === "blocked") return user.isBlocked;
        if (filterStatus === "active") return !user.isBlocked;
        return true;
      });
    }

    if (searchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        user =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(result);
  };

  const handleModalOpen = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;
    try {
      const endpoint =
        actionType === "block" ? "/admin/block-user" : "/admin/unblock-user";
      const response = await axiosInstance.patch(
        `${endpoint}/${selectedUser._id}`
      );
      if (response.data.status === "success") {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === selectedUser._id
              ? { ...user, isBlocked: actionType === "block" }
              : user
          )
        );
        toast.success(
          response.data.message ||
            `User ${actionType === "block" ? "blocked" : "unblocked"} successfully`
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update user status"
      );
    } finally {
      setModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowUserForm(true);
  };

  const handleAddUser = () => {
    setEditUser(null);
    setShowUserForm(true);
  };

  const handleUserFormClose = () => {
    setShowUserForm(false);
    setEditUser(null);
    fetchUsers(); 
  };

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
    <div className="p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Users List</h2>

      {/* Search, Filter, and Action Buttons Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black-default"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white-default text-black-default"
        >
          <option value="all">All Users</option>
          <option value="active">Active Users</option>
          <option value="blocked">Blocked Users</option>
        </select>

        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white-default rounded-lg hover:bg-green-600"
        >
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white-default text-left text-sm text-gray-500">
          <thead className="bg-green-200 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">E-Mail</th>
              <th className="px-6 py-3">Joined Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
              {/* <th className="px-6 py-3">Edit</th> */}
              <th className="px-6 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white-default"
                } border-b hover:bg-gray-100`}
              >
                <td className="px-6 py-4 text-gray-800">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isBlocked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() =>
                      handleModalOpen(user, user.isBlocked ? "unblock" : "block")
                    }
                    className={`py-1 px-4 rounded text-white-default ${
                      user.isBlocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="flex items-center gap-2 py-1 px-4 rounded text-white-default bg-blue-500 hover:bg-blue-600"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="bg-green-500 text-white-default py-1 px-4 rounded hover:bg-green-600"
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>


      {/* Modal for Block/Unblock Confirmation */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={`Confirm ${actionType}`}
        message={`Are you sure you want to ${
          actionType === "block" ? "block" : "unblock"
        } ${selectedUser?.name}?`}
        confirmText={actionType === "block" ? "Block" : "Unblock"}
        cancelText="Cancel"
      />

      {/* Add/Edit User Form Modal */}
      {showUserForm && (
        <UserForm
          user={editUser}
          onClose={handleUserFormClose}
          isOpen={showUserForm}
        />
      )}
    </div>
  );
};

export default AllUsers;