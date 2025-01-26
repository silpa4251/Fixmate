import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isRegisterPage = location.pathname === "/register/user";
  const isLoginPage = location.pathname === "/login/user";

  const buttonText =  isAuthenticated
  ? "Logout"
  : isRegisterPage
  ? "Sign In" 
  : isLoginPage 
  ? "Sign Up" 
  : "Need a service?";
  const buttonAction = () => {
    if (isAuthenticated) {
      dispatch(logout());
      navigate("/"); 
    } else {
      navigate(isLoginPage ? "/register" : "/login");
    }
  };

  return (
    <nav className="fixed top-0 w-full flex items-center justify-between px-6 py-4 bg-black-default bg-opacity-60 h-20 z-50 ">
      
        <NavLink to="/" className="flex items-center">
        <img src="/logo.png" alt="FixMate Logo" className="h-12 sm:h-16" />
        <span className="text-xl sm:text-2xl font-bold ml-2 text-green-default">
          FixMate
        </span>
        </NavLink>
    

      
      <div className="hidden md:flex space-x-6 lg:space-x-8 text-green-default font-medium text-sm sm:text-lg">
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
      <button 
       onClick={buttonAction} 
      className="hidden md:block bg-green-default text-black-default px-4 py-2 rounded-full hover:bg-green-bright transition-all duration-200">
       {buttonText}
      </button>

      {/* Mobile View */}
      <div className="md:hidden flex items-center space-x-4">
      <button
       onClick={buttonAction} 
       className=" bg-green-default text-black-default px-4 py-2 rounded-full hover:bg-green-bright transition-all duration-200">
       {buttonText}
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