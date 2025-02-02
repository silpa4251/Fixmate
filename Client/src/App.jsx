import { Route, Routes } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import LandingPage from "./page/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Sidebar from "./components/Admin/Sidebar";
import Unauthorized from "./page/Unauthorized";
import AdminRoutes from "./routes/AdminRoutes";
import Dashboard from "./components/Admin/dashboard";
import { useSelector } from "react-redux";
import Loading from "./page/loading";
import Footer from "./components/Footer/Footer";
import Home from "./page/Home";
import UserRegister from "./components/Auth/UserRegister";
import UserLogin from "./components/Auth/UserLogin";
import ProviderRegister from "./components/Provider/ProviderRegister";
import ProviderLogin from "./components/Provider/ProviderLogin";
import BookService from "./components/User/BookService";
import ProtectedRoute from "./routes/ProtectedRoute";
// import UserNavbar from "./components/Navbar/UserNavbar";
import AllUsers from "./components/Admin/AllUsers";
import AllProviders from "./components/Admin/AllProviders";

// import axios from "axios"
// import { GoogleLogin } from "@react-oauth/google"


function App() {
  // const { role } = useSelector((state) => state.auth);

  return (
    <>
    <NavbarConditional />
    {/* {role === "User" ? <UserNavbar /> : role !== "Admin" && <Navbar />} */}
      <Routes>
     
          <Route path="/" element={<LandingPage />}/>
          <Route path="/user/register" element={<UserRegister />}/>
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/provider/register" element={<ProviderRegister />}/>
          <Route path="/provider/login" element={<ProviderLogin />}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/loading" element={<Loading />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/book/:id" element={<BookService />} />
          </Route>
          
          <Route element={<AdminRoutes />}>
            <Route path = '/admin' element={<Sidebar />} >
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='users' element={<AllUsers />} />
            <Route path='providers' element={<AllProviders />} />
          </Route>
          </Route>
      </Routes>
    <Footer />
     
       
    </>
   
  )
}

const NavbarConditional = () => {
  const { role } = useSelector((state) => state.auth);
  return !(role === "Admin")   && <Navbar />;

}
export default App
