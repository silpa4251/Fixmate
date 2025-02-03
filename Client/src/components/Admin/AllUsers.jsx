import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle user block
  const handleBlock = async (userId) => {
    try {
      await axiosInstance.put(`/users/block/${userId}`);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
      ));
      alert("User status updated successfully.");
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Users List</h2>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white text-left text-sm text-gray-500">
          <thead className="bg-green-200 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">E-Mail</th>
              {/* <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Location</th> */}
              <th className="px-6 py-3">Joined Date</th>
              <th className="px-6 py-3">Actions</th>
              <th className="px-6 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white-default"
                } border-b hover:bg-gray-100`}
              >
                <td className="px-6 py-4 text-gray-800">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                {/* <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.location}</td> */}
                <td className="px-6 py-4">{user.createdAt}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleBlock(user._id)}
                    className={`py-1 px-4 rounded text-white-default ${
                      user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
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

export default AllUsers;
