import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { FiMenu, FiX } from "react-icons/fi";
import { logoutApi } from "../../api/AuthApi";

const UserNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
    navigate("/user/login");
  };

  return (
    <nav className="fixed top-0 w-full flex items-center justify-between px-6 py-4 bg-black-default bg-opacity-60 h-20 z-50 ">
      <Link to="/" className="flex items-center">
        <img src="/logo.png" alt="FixMate Logo" className="h-12 sm:h-16" />
        <span className="text-xl sm:text-2xl font-bold ml-2 text-green-default">
          FixMate
        </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:ml-28 space-x-6 lg:space-x-8 text-green-default font-medium text-sm sm:text-lg">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/bookings" className="hover:underline">Bookings</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
        </div>

        {/* Profile Image & Logout */}
        <div className="hidden md:flex items-center space-x-6">
          {user?.image ? (
            <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
              <span className="text-white-default text-xl">{user?.name?.charAt(0)}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="bg-green-button text-white-dark px-4 py-2 rounded-md text-white hover:bg-green-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <Link to="/" className="block text-center hover:text-gray-300">Home</Link>
          <Link to="/bookings" className="block text-center hover:text-gray-300">Bookings</Link>
          <Link to="/profile" className="block text-center hover:text-gray-300">Profile</Link>
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
