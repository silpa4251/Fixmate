import Navbar from "../components/Navbar/Navbar";
import About from "../assets/about.png"
import { MdCalendarMonth, MdOutlinePlaylistAddCheck, MdPersonSearch } from "react-icons/md";
import { BsTools } from "react-icons/bs";


const LandingPage = () => {
  return (
    <>
    <header className="bg-overlay text-white h-screen flex flex-col items-center justify-center relative" id="home">

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
    <section className="bg-grey-medium py-12 px-6 md:px-12 lg:px-20" id="about">
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


    <section className="bg-white py-12 px-6 md:px-12 lg:px-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-black-default">
          How it works
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Follow these simple steps to get connected with trusted local service
          providers.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
  {/* Step 1 */}
  <div className="bg-green-100 p-6 rounded-lg shadow-lg">
    <span className="bg-green-500 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center mb-4">
      1
    </span>
    <MdPersonSearch className="text-green-500 text-4xl mb-2" />
    <p className="font-medium">Search for Services</p>
  </div>
  {/* Step 2 */}
  <div className="bg-green-100 p-6 rounded-lg shadow-lg">
    <span className="flex bg-green-500 text-white rounded-full w-10 h-10 mx-auto items-center justify-center mb-4">
      2
    </span>
    <MdOutlinePlaylistAddCheck className="text-green-500 text-4xl mb-2" />
    <p className="font-medium">Compare and Choose</p>
  </div>
  {/* Step 3 */}
  <div className="bg-green-100 p-6 rounded-lg shadow-lg">
    <span className="bg-green-500 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center mb-4">
      3
    </span>
    <MdCalendarMonth className="text-green-500 text-4xl mb-2" />
    <p className="font-medium">Book and Connect</p>
  </div>
  {/* Step 4 */}
  <div className="bg-green-100 p-6 rounded-lg shadow-lg">
    <span className="bg-green-500 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center mb-4">
      4
    </span>
    <BsTools className="text-green-500 text-4xl mb-2" />
    <p className="font-medium">Get the Job Done</p>
  </div>
</div>


      {/* Key Features Section */}
      <div className="text-center mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-black-default">
          Key Features That Set Us Apart
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
        {/* Feature 1 */}
        <div className="text-center">
          <img
            src="/trusted-providers.png" // Replace with your icon path
            alt="Trusted Providers"
            className="mx-auto w-12 h-12 mb-4"
          />
          <p className="font-medium text-sm md:text-base">
            Trusted Providers
          </p>
        </div>
        {/* Feature 2 */}
        <div className="text-center">
          <img
            src="/location-search.png" // Replace with your icon path
            alt="Location-Based Search"
            className="mx-auto w-12 h-12 mb-4"
          />
          <p className="font-medium text-sm md:text-base">
            Location-Based Search
          </p>
        </div>
        {/* Feature 3 */}
        <div className="text-center">
          <img
            src="/real-time-chat.png" // Replace with your icon path
            alt="Real-Time Chat"
            className="mx-auto w-12 h-12 mb-4"
          />
          <p className="font-medium text-sm md:text-base">Real-Time Chat</p>
        </div>
        {/* Feature 4 */}
        <div className="text-center">
          <img
            src="/wide-range.png" // Replace with your icon path
            alt="Wide Range of Services"
            className="mx-auto w-12 h-12 mb-4"
          />
          <p className="font-medium text-sm md:text-base">
            Wide Range of Services
          </p>
        </div>
        {/* Feature 5 */}
        <div className="text-center">
          <img
            src="/transparent-pricing.png" // Replace with your icon path
            alt="Transparent Pricing"
            className="mx-auto w-12 h-12 mb-4"
          />
          <p className="font-medium text-sm md:text-base">
            Transparent Pricing
          </p>
        </div>
      </div>
    </section>
    </>
  )
}

export default LandingPage