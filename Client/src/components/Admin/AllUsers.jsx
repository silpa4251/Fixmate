// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { fetchAllUsers, blockUser, unblockUser } from "../../features/userSlice";
// import { FaSearch } from "react-icons/fa";

// const AllUsers = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("All");
//   const [localUsers, setLocalUsers] = useState([]);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { users, loading } = useSelector((state) => state.user);

//   useEffect(() => {
//     dispatch(fetchAllUsers());
//   }, [dispatch]);

//   useEffect(() => {
//     setLocalUsers(users);
//   }, [users]);

//    // Handle user blocking
//    const handleBlock = async (id) => {
//     await dispatch(blockUser(id));
//     setLocalUsers((prevUsers) =>
//       prevUsers.map((user) =>
//         user._id === id ? { ...user, isBlocked: true } : user
//       )
//     );
//   };

//   // Handle user unblocking
//   const handleUnblock = async (id) => {
//     await dispatch(unblockUser(id));
//     setLocalUsers((prevUsers) =>
//       prevUsers.map((user) =>
//         user._id === id ? { ...user, isBlocked: false } : user
//       )
//     );
//   };

//   const viewDetails = (id) => {
//     navigate(`/admin/users/${id}`);
//   };

//   const filteredUsers = users
//     .filter(
//       (user) =>
//         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .filter((user) => {
//       if (filter === "Active") return !user.isBlocked;
//       if (filter === "Blocked") return user.isBlocked;
//       return true;
//     });

//   return (
//     <div className="p-4 sm:p-6 bg-white shadow rounded-lg mt-6">
//       <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-pink">Users</h2>
//       <div className="flex flex-col sm:flex-row sm:justify-end items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
//         <div className="relative w-full sm:w-auto">
//           <input
//             type="text"
//             placeholder="Search by username or email"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full sm:w-64 border-2 border-slate-200 focus:border-slate-300 rounded p-2 pr-10"
//           />
//           <FaSearch size={20} className="absolute right-2 top-[10px] text-pink" />
//         </div>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="w-full sm:w-auto border-2 border-slate-200 focus:border-slate-300 rounded p-2"
//         >
//           <option value="All">All</option>
//           <option value="Active">Active</option>
//           <option value="Blocked">Blocked</option>
//         </select>
//       </div>
//       <div className="overflow-x-auto">
//         {loading ? (
//           <p>Loading users...</p>
//         ) : (
//           <table className="min-w-full border border-gray-200">
//             <thead>
//               <tr className="bg-gray-300">
//                 <th className="border px-4 py-2 text-left">Username</th>
//                 <th className="border px-4 py-2 text-left">Email</th>
//                 <th className="border px-4 py-2 text-left">Status</th>
//                 <th className="border px-2 sm:px-4 py-2 text-left">Details</th>
//                 <th className="border px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//             {filteredUsers.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="border px-4 py-2 text-center">No users found</td>
//               </tr>
//             ) : (
//               filteredUsers && filteredUsers.map((user) => (
//                 <tr key={user._id} className="border-b hover:bg-gray-50">
//                   <td className="border px-4 py-2">{user.username}</td>
//                   <td className="border px-4 py-2">{user.email}</td>
//                   <td className="border px-4 py-2">
//                     <span
//                       className={`py-1 px-3 rounded-full text-white text-sm ${
//                         user.isBlocked ? "bg-red-500" : "bg-green-500"
//                       }`}
//                     >
//                       {user.isBlocked ? "Blocked" : "Active"}
//                     </span>
//                   </td>
//                   <td className="border px-2 sm:px-4 py-2">
//                     <button onClick={() => viewDetails(user._id)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//                       View Details
//                     </button>
//                   </td>
//                   <td className="border px-4 py-2">
//                     <div className="flex space-x-2">
//                       {user.isBlocked ? (
//                         <button
//                           className="bg-green-500 text-white px-4 py-2 rounded"
//                           onClick={() => handleUnblock(user._id)}
//                         >
//                           Unblock
//                         </button>
//                       ) : (
//                         <button
//                           className="bg-red-500 text-white px-4 py-2 rounded"
//                           onClick={() => handleBlock(user._id)}
//                         >
//                           Block
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllUsers;
