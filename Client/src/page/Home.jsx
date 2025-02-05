import homeImage from "../assets/home.png";
import SearchBar from "../components/User/SearchBar";
// import ProviderList from "./components/ProviderList";
import MapComponent from "../components/Map/MapComponent";
import { useState } from "react";
import ProviderList from "../components/Provider/ProviderList";
import UserNavbar from "../components/Navbar/UserNavbar";


const Home = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [serviceQuery, setServiceQuery] = useState("");

  const handleSearch = (providers) => {
    setServiceProviders(providers);
  };

  const handleServiceQueryChange = (query) => {
    setServiceQuery(query);
  };

  return (
    <>
    <UserNavbar />
    <div className="min-h-screen bg-green-pale">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[500px]" style={{ backgroundImage: `url(${homeImage})`}}>
        <div className="absolute inset-0 bg-black-default bg-opacity-50 flex flex-col items-center justify-center text-white-default">
          <h1 className="text-4xl font-bold text-center">Find Trusted Local Services Near You!</h1>
          <div className="mt-4 w-11/12 md:w-3/4">
            <SearchBar setServiceProviders={handleSearch}/>
          </div>  
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-8">
        {/* Provider List */}
        <div>
          <ProviderList  providers={serviceProviders}/>
        </div>

        {/* Map Component */}
        <div>
        <MapComponent  serviceQuery={serviceQuery} providers={serviceProviders}   setProviders={setServiceProviders}  />
        </div>
      </div>
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Verified Providers", desc: "All service providers are thoroughly vetted" },
              { title: "Instant Booking", desc: "Book services with just a few clicks" },
              { title: "Satisfaction Guaranteed", desc: "100% satisfaction or money back guarantee" }
            ].map((feature, idx) => (
              <div key={idx} 
                   className="bg-white rounded-lg shadow-md hover:shadow-lg 
                            transition duration-200 p-6 text-center">
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  {feature.title}
                </h3>
                <p className="text-green-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer (Optional for pagination) */}
      {/* <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">Showing page 1 of 3</p>
      </div> */}
    </div>
  </>
  );
};
export default Home;
