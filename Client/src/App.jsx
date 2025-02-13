import { Route, Routes, useLocation } from "react-router-dom"
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
import UserNavbar from "./components/Navbar/UserNavbar";
import AllUsers from "./components/Admin/AllUsers";
import AllProviders from "./components/Admin/AllProviders";
import Bookings from "./components/User/Bookings";
import RescheduleBooking from "./components/User/RescheduleBooking";
import AdminLogin from "./components/Admin/AdminLogin";
import PaymentForm from "./components/PaymentForm";
import CheckoutPage from "./components/User/CheckoutPage";
import AllBookings from "./components/Admin/AllBookings";
import ViewUser from "./components/Admin/ViewUser";
import ViewProvider from "./components/Admin/ViewProvider";
import Profile from "./components/User/Profile";
import ProviderRoutes from "./routes/ProviderRoutes";
import SideBar from "./components/Provider/SideBar";
import DashBoard from "./components/Provider/Dashboard";
import ProfilePage from "./components/Provider/ProfilePage";
import TotalBookings from "./components/Provider/TotalBookings";

// import axios from "axios"
// import { GoogleLogin } from "@react-oauth/google"


function App() {
  const location = useLocation();
  const { role } = useSelector((state) => state.auth);
  const isAdminOrProviderRoute = location.pathname.startsWith("/admin") || location.pathname.startsWith("/provider");


  return (
    <>
   {!isAdminOrProviderRoute && (
        role === "User" ? <UserNavbar /> : <Navbar />
      )}
      <Routes>
     
          <Route path="/" element={<LandingPage />}/>
          <Route path="/register/user" element={<UserRegister />}/>
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/register/provider" element={<ProviderRegister />}/>
          <Route path="/login/provider" element={<ProviderLogin />}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/payment" element={<PaymentForm />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/book/:id" element={<BookService />} />
            <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/reschedule/:bookingId" element={<RescheduleBooking />} />
            <Route path="/user/profile" element={<Profile />} />
          </Route>
            
          <Route element={<ProviderRoutes />}>
            <Route path = '/provider' element={<SideBar />} >
            <Route index element={<DashBoard />} />
            <Route path='dashboard' element={<DashBoard />} /> 
            <Route path='profile' element={<ProfilePage />} />
            <Route path="bookings" element={<TotalBookings />} /> 
          </Route>
          </Route>


          <Route element={<AdminRoutes />}>
            <Route path = '/admin' element={<Sidebar />} >
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='users' element={<AllUsers />} />
            <Route path="users/:id" element={<ViewUser />} />
            <Route path='providers' element={<AllProviders />} />
            <Route path='providers/:id' element={<ViewProvider />} />
            <Route path="bookings" element={<AllBookings />} />
          </Route>
          </Route>
      </Routes>
      {!isAdminOrProviderRoute && <Footer />}
     
       
    </>
   
  )
}


export default App
