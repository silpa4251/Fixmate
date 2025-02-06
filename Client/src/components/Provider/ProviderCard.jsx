
import { NavLink } from "react-router-dom";

const ProviderCard = ({ provider }) => {
  console.log("img",provider);
    return (
     
      <NavLink
      to={`/book/${provider._id}`}
      className="block transition-transform hover:scale-[1.02] duration-300"
    >
      <div className="bg-white-default rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
        <div className="w-full sm:w-48 h-48 sm:h-40 lg:h-48 shrink-0">
          <img
            src={provider.image}
            alt={`${provider.name}'s profile`}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>      
        
        <div className="flex-1 space-y-3">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {provider.name}
          </h3>
          
          <div className="space-y-2">
            <p className="flex items-center text-sm sm:text-base text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="ml-2">{provider.services}</span>
            </p>
            
            <p className="flex items-center text-sm sm:text-base text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="ml-2">
                {provider.address[0].place}, {provider.address[0].district}
              </span>
            </p>
            
            <p className="flex items-center text-sm sm:text-base text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="ml-2">Rs.{provider.charge}</span>
            </p>
          </div>

          <button className="w-full sm:w-auto mt-4 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium">
            Book Now
          </button>
        </div>
      </div>
    </NavLink>
    );
  };
  
  export default ProviderCard;