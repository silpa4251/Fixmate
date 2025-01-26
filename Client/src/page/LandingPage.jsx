
import About from "../assets/about.png"
import { MdCalendarMonth, MdOutlinePlaylistAddCheck, MdPersonSearch } from "react-icons/md";
import { BsTools } from "react-icons/bs";
import ContactUs from "../components/Auth/ContactUs";
import Testimonials from "../components/Testimonials";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <>
    <div className="bg-overlay">
    <header className="text-white h-screen flex flex-col items-center justify-center relative" id="home">

      <div className="text-center px-4">
        <p className="text-base text-white-medium sm:text-lg md:text-xl">
          We provide quality service
        </p>
        <h1 className="text-2xl text-white-default sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 leading-tight">
          Connecting You to Trusted Local Experts,
          <br />
          Anytime, Anywhere!
        </h1>
        <p className="mt-4 text-sm text-white-medium sm:text-base md:text-lg leading-relaxed">
          We simplify the process of finding, booking, and reviewing reliable
          experts in your area,
          <br />
          ensuring quality service and peace of mind.
        </p>
        <button className="mt-6 bg-green-default px-6 py-3 text-sm sm:text-base md:text-lg rounded-full hover:bg-green-bright transition-all duration-200">
          Read more
        </button>
      </div>
      
    </header>
    <section className="bg-grey-medium py-12 px-6 rounded-lg shadow-lg md:px-12 lg:px-20" id="about">
    <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start">
    <div className="w-full lg:w-1/2 lg:pl-12 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-black-default mb-4">
                Few Words About Us
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                At FixMate, we connect you with trusted local service providers for
                all your repair and maintenance needs. From finding skilled experts
                to seamless booking, we prioritize reliability, transparency, and
                convenience. FixMate isn&apos;t just about solving problems — it&apos;s about
                building a community of trust and professionalism. <br />
                Let&apos;s fix it, together!
            </p>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mb-6 lg:mb-4">
            <img src={About} alt="About us"    className="max-w-full h-auto"  />
        </div>
       
    </div>
    </section>


    <section className="py-12 px-6 md:px-12 lg:px-20" id="working">
  <div className="text-center mb-12">
    <h2 className="text-2xl md:text-3xl font-bold text-white-default">
      How it works
    </h2>
    <p className="text-white-default mt-2 text-sm md:text-base">
      Follow these simple steps to get connected with trusted local service
      providers.
    </p>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
    {/* Step 1 */}
    <div className="relative p-6 rounded-lg shadow-lg border mb-3">
      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-black-default rounded-full w-10 h-10 flex items-center justify-center">
        1
      </span>
      <MdPersonSearch className="text-white-medium text-6xl mx-auto mb-4 mt-6" />
      <p className="font-medium text-white-medium">Search for Services</p>
    </div>
    {/* Step 2 */}
    <div className="relative p-6 rounded-lg shadow-lg border mb-3">
      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-black-default rounded-full w-10 h-10 flex items-center justify-center">
        2
      </span>
      <MdOutlinePlaylistAddCheck className="text-white-medium text-6xl mx-auto mb-4 mt-6" />
      <p className="font-medium text-white-medium">Compare and Choose</p>
    </div>
    {/* Step 3 */}
    <div className="relative p-6 rounded-lg shadow-lg border mb-3">
      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-black-default rounded-full w-10 h-10 flex items-center justify-center">
        3
      </span>
      <MdCalendarMonth className="text-white-medium text-6xl mx-auto mb-4 mt-6" />
      <p className="font-medium text-white-medium">Book and Connect</p>
    </div>
    {/* Step 4 */}
    <div className="relative p-6 rounded-lg shadow-lg border mb-3">
      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-black-default rounded-full w-10 h-10 flex items-center justify-center">
        4
      </span>
      <BsTools className="text-white-medium text-6xl mx-auto mb-4 mt-6" />
      <p className="font-medium text-white-medium">Get the Job Done</p>
    </div>
  </div>
  </section>
  </div>

  <ContactUs id="contact" />
  <Testimonials />

  
    </>
  )
}

export default LandingPage