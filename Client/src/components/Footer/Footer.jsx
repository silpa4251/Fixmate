import logo from "../../assets/logo.png";

import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-grey-darker text-white-medium py-8 px-4 md:px-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center">
          <img
            src={logo} 
            alt="FixMate Logo"
            className="w-48 h-52 -mb-7"
          />
          <p className="text-center">
            Connecting You to Trusted Local Experts, Anytime, Anywhere!
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-green-500">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-500">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-500">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-500">
                How It Works?
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-500">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-500">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-green-500">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-500">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-500">
                Payment Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <p className="mb-2">support@fixmate.com</p>
          <p className="mb-4">+91 8547623859</p>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="#" className="hover:text-green-500 text-lg">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-green-500 text-lg">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-green-500 text-lg">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-sm text-gray-400">
          © 2025 FixMate. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
