import { Route, Routes } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import LandingPage from "./page/LandingPage"
import Register from "./components/Auth/Register"
import Login from "./components/Auth/Login";
import Navbar from "./components/Navbar/Navbar";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import dashboard from "./components/Admin/dashboard";
// import axios from "axios"
// import { GoogleLogin } from "@react-oauth/google"


function App() {


  return (
    <>
     <Navbar />
      <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/dashboard" element={<dashboard />} />

      </Routes>
       {/* <div>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const post = await axios.post('http://localhost:8000/api/auth/googleauth', credentialResponse)
          console.log(post,"responsefrontend")
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      
    
      
    </div> */}
    </>
   
  )
}
export default App
