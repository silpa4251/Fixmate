import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchQuery, onSearch }) => {
  return (
    
    <div className="relative flex justify-center mt-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full max-w-lg px-4 py-2 border rounded-lg text-black-default"
        placeholder="What service are you looking for?"
      />
     <FaSearch className="absolute right-3 sm:right-28 md:right-[335px] top-1/2 transform -translate-y-1/2 text-slate-400" />
    </div>
  );
};

export default SearchBar;
