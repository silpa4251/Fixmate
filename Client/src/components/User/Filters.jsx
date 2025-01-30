

const Filters = ({ onFilterChange, onSortChange }) => {
  return (
    <div className="flex justify-between items-center mt-4 px-4">
      <div className="space-x-2">
        <button className="px-3 py-1 bg-gray-200 rounded-lg" onClick={() => onFilterChange('topRated')}>Top Rated</button>
        <button className="px-3 py-1 bg-gray-200 rounded-lg" onClick={() => onFilterChange('all')}>All Filters</button>
      </div>
      <div>
        <select
          className="px-3 py-1 border rounded-lg"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="ratings">Ratings</option>
          <option value="distance">Distance</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
