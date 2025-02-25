/* eslint-disable react/prop-types */
import { useState } from "react";
import ProviderCard from "./ProviderCard";

const ProviderList = ({ providers }) => {
  console.log("u6",providers);
  const [currentPage, setCurrentPage] = useState(1);
  const PROVIDER_PER_PAGE = 3;

  const lastIndex = currentPage * PROVIDER_PER_PAGE;
  const firstIndex =  lastIndex - PROVIDER_PER_PAGE;
  const currentProviders = providers.slice(
    firstIndex,
    lastIndex
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(providers.length / PROVIDER_PER_PAGE))
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="flex flex-col sm:max-w-2xl p-4">
      { currentProviders.length > 0 ? (
         currentProviders.map((provider) => (
          <ProviderCard key={provider._id} provider={provider} />
        ))
      ) : (
        <p className="text-gray-500 text-center">No providers found.</p>
      )}
            <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-button text-white-default hover:bg-green-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-600 mt-2">
          Page {currentPage} of{" "}
          {Math.ceil(providers.length / PROVIDER_PER_PAGE)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(providers.length / PROVIDER_PER_PAGE)}
          className={`px-4 py-2 rounded ${
            currentPage === Math.ceil(providers.length / PROVIDER_PER_PAGE)
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-button text-white-default hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProviderList;