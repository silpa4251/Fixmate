import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProviderRoutes = () => {
  const token = localStorage.getItem("token");
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const isProvider = token && role === "Provider";


  if (isAuthenticated && !isProvider) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default ProviderRoutes;
