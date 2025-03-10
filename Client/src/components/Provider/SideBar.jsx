import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../../assets/logo.png";
import { Clock, Star, FileText, User, Wallet, CalendarRange } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
// import Breadcrumbs from "./Breadcrumbs";
import { logoutApi } from "../../api/AuthApi";
import { MdOutlineLogout } from "react-icons/md";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated,user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login/provider");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(logout());
      navigate("/login/provider");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally add error handling here
    }
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-100 text-white-default">
      {/* Sidebar */}
      <aside className="w-60 bg-green-sidebar text-white p-6 flex flex-col">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="logo" className="w-24 h-28 mr-3" />
          <h1 className="text-3xl font-bold text-green-default">FixMate</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul>
            <li className="mb-4">
              <NavLink
                to="/provider/dashboard"
                className={({ isActive }) =>
                  `flex justify-center items-center p-3 rounded hover:bg-green-hover ${
                    isActive ? "bg-green-hover" : ""
                  }`
                }
              >
                <Clock size={24} className="mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/provider/profile"
                className={({ isActive }) =>
                  `flex justify-center items-center p-3 rounded hover:bg-green-hover ${
                    isActive ? "bg-green-hover" : ""
                  }`
                }
              >
                <User  size={24} className="mr-3" />
                Profile
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/provider/bookings"
                className={({ isActive }) =>
                  `flex justify-center items-center p-3 rounded hover:bg-green-hover ${
                    isActive ? "bg-green-hover" : ""
                  }`
                }
              >
                <CalendarRange size={24} className="mr-3" />
                Bookings
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/provider/reviews"
                className={({ isActive }) =>
                  `flex justify-center items-center p-3 rounded hover:bg-green-hover ${
                    isActive ? "bg-green-hover" : ""
                  }`
                }
              >
                <FileText size={24} className="mr-3" />
                Reviews
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-3 mb-20 text-white rounded hover:bg-green-hover transition"
        >
          <MdOutlineLogout size={24} className="mr-3" /> Logout
        </button>
      </aside>
      <main className="flex-1 p-6 bg-green-pale overflow-auto">
        <div className="p-6 bg-white-default shadow rounded-lg mt-2 mx-5 text-black-default">
          <h1 className="text-lg font-semibold">Welcome {user.name} !</h1>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default SideBar;