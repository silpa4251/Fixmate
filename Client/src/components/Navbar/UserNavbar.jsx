import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Install lucide-react for icons

const UserNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-green-400 px-4 py-2 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/path-to-your-logo.png"
            alt="FixMate Logo"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-xl font-bold">FixMate</span>
        </div>

        {/* Right Section - Hamburger for Small Screens */}
        <button
          className="md:hidden text-green-400 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Center Section - Links (Hidden on Small Screens) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="hover:text-green-300 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/bookings"
            className="hover:text-green-300 transition duration-300"
          >
            My Bookings
          </Link>
          <Link
            to="/profile"
            className="hover:text-green-300 transition duration-300"
          >
            My Profile
          </Link>
        </div>

        {/* Right Section - Profile & Logout (Hidden on Small Screens) */}
        <div className="hidden md:flex items-center space-x-4">
          <img
            src="/path-to-profile-image.jpg"
            alt="User Profile"
            className="h-8 w-8 rounded-full border border-green-400"
          />
          <button className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition duration-300">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-2">
          <Link
            to="/"
            className="hover:text-green-300 transition duration-300"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/bookings"
            className="hover:text-green-300 transition duration-300"
            onClick={() => setMenuOpen(false)}
          >
            My Bookings
          </Link>
          <Link
            to="/profile"
            className="hover:text-green-300 transition duration-300"
            onClick={() => setMenuOpen(false)}
          >
            My Profile
          </Link>
          <button
            className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition duration-300"
            onClick={() => setMenuOpen(false)}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
