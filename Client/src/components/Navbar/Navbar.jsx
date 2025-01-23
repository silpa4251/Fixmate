import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); 

  const isRegisterPage = location.pathname === "/register";
  const isLoginPage = location.pathname === "/login";

  const buttonText = isRegisterPage ? "Sign In" : isLoginPage ? "Sign Up" : "Get in Touch";
  const buttonRoute = isLoginPage
    ? "/register"
    : "/login";
    

  return (
    <nav className="fixed top-0 w-full flex items-center justify-between px-6 py-4 bg-black-default bg-opacity-60 h-20 z-50 ">
      <div className="flex items-center">
        <img src="/logo.png" alt="FixMate Logo" className="h-12 sm:h-16" />
        <span className="text-xl sm:text-2xl font-bold ml-2 text-green-default">
          FixMate
        </span>
      </div>

      
      <ul className="hidden md:flex space-x-6 lg:space-x-8 text-green-default font-medium text-sm sm:text-lg">
        <li>
          <a href="#home" className="hover:underline">
            Home
          </a>
        </li>
        <li>
          <a href="#about" className="hover:underline">
            About
          </a>
        </li>
        <li>
          <a href="#features" className="hover:underline">
            Features
          </a>
        </li>
        <li>
          <a href="#contact" className="hover:underline">
            Contact Us
          </a>
        </li>
      </ul>
      <button 
       onClick={() => navigate(buttonRoute)} 
      className="hidden md:block bg-green-default text-black-default px-4 py-2 rounded-full hover:bg-green-bright transition-all duration-200">
       {buttonText}
      </button>

      {/* Mobile View */}
      <div className="md:hidden flex items-center space-x-4">
      <button
       onClick={() => navigate(buttonRoute)} 
       className=" bg-green-default text-black-default px-4 py-2 rounded-full hover:bg-green-bright transition-all duration-200">
       {buttonText}
      </button>
      

      <div
        className=" text-green-default text-2xl cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </div></div>
      {isOpen && (
        <div className="fixed top-20 left-0 w-full bg-black-default bg-opacity-60 text-green-default flex flex-col items-center space-y-4 py-6">
          <a
            href="#home"
            className="hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="#about"
            className="hover:underline"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a
            href="#features"
            className="hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Features
          </a>
          <a
            href="#contact"
            className="hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </a>
        
        </div>
      )}
    </nav>
  );
};

export default Navbar;