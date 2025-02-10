import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../../assets/logo.png";
import { MdSpaceDashboard, MdOutlineEditCalendar, MdOutlineLogout } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { BsTools } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import Breadcrumbs from "./Breadcrumbs";
import { logoutApi } from "../../api/AuthApi";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(logout());
      navigate("/admin/login");
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
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex justify-center items-center p-3 rounded hover:bg-green-hover ${
                    isActive ? "bg-green-hover" : ""
                  }`
                }
              >
                <MdSpaceDashboard size={24} className="mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex justify-center items-center p-3 rounded hover:bg-green-hover ${
                    isActive ? "bg-green-hover" : ""
                  }`
                }
              >
                <FaUserEdit size={24} className="mr-3" />
                Users List
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/admin/providers"
                className={({ isActive }) =>
                  `flex justify-center items-center p-3 rounded hover:bg-green-hover ${
                    isActive ? "bg-green-hover" : ""
                  }`
                }
              >
                <BsTools size={24} className="mr-3" />
                Providers
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  `flex justify-center items-center p-3 rounded hover:bg-green-hover ${
                    isActive ? "bg-green-hover" : ""
                  }`
                }
              >
                <MdOutlineEditCalendar size={24} className="mr-3" />
                Bookings
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/admin/payments"
                className={({ isActive }) =>
                  `flex justify-center items-center p-3 rounded hover:bg-green-hover ${
                    isActive ? "bg-green-hover" : ""
                  }`
                }
              >
                <GrMoney size={24} className="mr-3" />
                Payments
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
        <div className="p-6 bg-white-default shadow rounded-lg mt-2 mx-5">
          <Breadcrumbs />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;