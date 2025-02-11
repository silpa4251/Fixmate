import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { logout } from "../../redux/authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); 

  const isRegisterPage = location.pathname === "/user/register";
  const isLoginPage = location.pathname === "/user/login";
  const isRegisterProvider = location.pathname === "/provider/register";
  const isLoginProvider = location.pathname === "/provider/login";

  const userText = isRegisterPage
  ? "Sign In" 
  : isLoginPage 
  ? "Sign Up" 
  : "Need a service?";

  const providerText = isRegisterProvider
  ? "Sign In" 
  : isLoginProvider 
  ? "Sign Up" 
  : "Join as a provider";

  const userAction = () => {
  
      navigate(isLoginPage ? "/register/user" : "/login/user");

  };

  const providerAction = () => {
      navigate(isLoginProvider ? "/register/provider" : "/login/provider");
  };

  return (
    <nav className="fixed top-0 w-full flex items-center justify-between px-6 py-4 bg-black-default bg-opacity-60 h-20 z-50 ">
      
        <NavLink to="/" className="flex items-center">
        <img src="/logo.png" alt="FixMate Logo" className="h-12 sm:h-16" />
        <span className="text-xl sm:text-2xl font-bold ml-2 text-green-default">
          FixMate
        </span>
        </NavLink>
    

      
      <div className="hidden md:flex md:ml-28 space-x-6 lg:space-x-8 text-green-default font-medium text-sm sm:text-lg">
          <NavLink to="/#home" className="hover:underline">
            Home
          </NavLink>
  
        
          <NavLink to="/#about" className="hover:underline">
            About
          </NavLink>
      
          <NavLink to="/#working" className="hover:underline">
            How it works
          </NavLink>

          <NavLink to="/#contact" className="hover:underline">
            Contact Us
          </NavLink>
      </div>
      <div className="hidden md:flex space-x-0">
      <button 
       onClick={providerAction} 
      className="hidden md:block text-green-default px-4 py-2 rounded-full hover:underline transition-all duration-200 font-medium text-sm sm:text-lg">
       {providerText}
      </button>
      <button 
       onClick={userAction} 
      className="hidden md:block text-green-default px-4 py-2 rounded-full hover:underline transition-all duration-200 font-medium text-sm sm:text-lg">
       {userText}
      </button>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center">
      <button
       onClick={providerAction} 
       className=" text-green-default px-2 py-2 rounded-full hover:underline transition-all duration-200 font-medium text-sm sm:text-lg">
       {providerText}
      </button>
      <button
       onClick={userAction} 
       className=" text-green-default px-2 py-2 rounded-full hover:underline transition-all duration-200 font-medium text-sm sm:text-lg">
       {userText}
      </button>
      

      <div
        className=" text-green-default text-2xl cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </div>
      </div>
      {isOpen && (
        <div className="fixed top-20 left-0 w-full bg-black-default bg-opacity-60 text-green-default flex flex-col items-center space-y-4 py-6">
          <NavLink
            to="/#home"
            className="hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/#about"
            className="hover:underline"
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/#working"
            className="hover:underline"
            onClick={() => setIsOpen(false)}
          >
            How it works
          </NavLink>
          <NavLink
            to="/#contact"
            className="hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </NavLink>
        
        </div>
      )}
    </nav>
  );
};

export default Navbar;