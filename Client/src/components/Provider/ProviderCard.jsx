
import { NavLink } from "react-router-dom";

const ProviderCard = ({ provider }) => {
  console.log("img",provider);
    return (
     
    <NavLink key={provider.email} to={`/book/${provider._id}`} >
    <div className="flex flex-row items-center bg-white-default shadow-md rounded-2xl p-4 space-y-0 space-x-6  mb-4">
        <div className="w-24 h-24 md:w-32 md:h-32">
        <img
          src={provider.image}
          alt={`${provider.name}'s profile`}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <div className="flex-1 space-y-2">
          {/* Provider Name */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{provider.name}</h3>
  
          {/* Service Offered */}
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Service:</span> {provider.services}
          </p>
  
          {/* Address */}
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Address:</span> {provider.address[0].place},{provider.address[0].district}
          </p>
  
          {/* Contact Information */}
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Charge(hour):</span> {provider.charge}
          </p>
  
          {/* Rating (Optional) */}
          {/* <div className="flex items-center mb-2">
            <span className="text-yellow-500">★★★★☆</span>
            <span className="text-sm text-gray-600 ml-2">(4.0)</span>
          </div> */}
  
          {/* Call to Action Button */}
          <button className="w-full bg-green-button text-white-default py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300">
            Book a service
          </button>
        </div>
      </div>
      </NavLink>
    );
  };
  
  export default ProviderCard;