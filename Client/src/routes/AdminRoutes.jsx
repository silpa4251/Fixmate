import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const token = localStorage.getItem("token");
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const isAdmin = token && role === "Admin";


  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default AdminRoutes;
