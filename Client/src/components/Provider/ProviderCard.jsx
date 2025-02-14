/* eslint-disable react/prop-types */
import { MapPin, Wallet, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";

const ProviderCard = ({ provider }) => {
    return (
     
      <NavLink
      to={`/book/${provider._id}`}
      className="block transition-transform hover:scale-[1.02] duration-300"
    >
      <div className="bg-white-default rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
        <div className="w-full sm:w-40 h-36 sm:h-40 lg:h-40 shrink-0">
          <img
            src={provider.image}
            alt={`${provider.name}'s profile`}
            className="w-full h-full object-contain sm:object-cover rounded-xl"
          />
        </div>      
        
        <div className="flex-1">
          <h3 className="text-xl sm:text-xl font-semibold text-gray-800 mb-2 ">
            {provider.name}
          </h3>
          
          <div className="space-y-2">
            <p className="flex text-sm sm:text-base text-gray-600">
             <Wrench />
              <span className="ml-2">{provider.services}</span>
            </p>
            
            <p className="flex items-center text-sm sm:text-base text-gray-600">
             <MapPin />
              <span className="ml-2">
                {provider.address[0].place}, {provider.address[0].district}
              </span>
            </p>
            
            <p className="flex items-center text-sm sm:text-base text-gray-600 mb-2">
            <Wallet />
              <span className="ml-2">Rs.{provider.charge}</span>
            </p>
          </div>

          <button className="w-full sm:w-auto mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium">
            Book Now
          </button>
        </div>
      </div>
    </NavLink>
    );
  };
  
  export default ProviderCard;