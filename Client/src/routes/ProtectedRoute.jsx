import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated && !token) {
    return <Navigate to="/user/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;



