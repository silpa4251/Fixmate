import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Search, Star } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import useDebounce from "../../hooks/useDebounce";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(6); // Number of reviews per page
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewReview, setViewReview] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch reviews for the provider
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/ratings/provider`, {
          params: { page: currentPage, limit },
        });
        console.log('try', response.data)
        setReviews(response.data.feedbacks);
        setFilteredReviews(response.data.feedbacks);
        setTotalPages(response.data.pagination.totalPages);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch reviews.");
        setLoading(false);
      }
    };
    fetchReviews();
  }, [currentPage, limit]);

  // Filter reviews based on search term and rating filter
  useEffect(() => {
    let filtered = [...reviews];

    if (ratingFilter !== "all") {
      filtered = filtered.filter((review) => review.rating === parseInt(ratingFilter));
    }

    if (searchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((review) =>
        review.user.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredReviews(filtered);
  }, [searchTerm, ratingFilter, reviews]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Open modal to view review details
  const handleViewReview = (review) => {
    setViewReview(review);
    setIsViewModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setViewReview(null);
  };

  // Get star icons for rating
  const getStarIcons = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          size={16}
          fill={index < rating ? "#FFD700" : "none"}
          stroke={index < rating ? "#FFD700" : "#ccc"}
        />
      ));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black-default">All Reviews</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black-default"
        />

        {/* Rating Filter */}
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white-default text-black-default"
        >
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} Stars
            </option>
          ))}
        </select>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white-default divide-y divide-gray-200 text-black-default">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <tr key={review._id}>
                <td className="px-6 py-4 whitespace-nowrap text-black-default">{review.userId.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-black-default">{getStarIcons(review.rating)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-black-default">{review.comment || "No comment"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-black-default">
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewReview(review)}
                    className="bg-green-500 text-white-default py-1 px-4 rounded hover:bg-green-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* View Review Modal */}
      {isViewModalOpen && viewReview && (
        <Modal onClose={handleCloseModal} title="Review Details">
          <div className="space-y-4 text-black-default bg-amber-500">
            <p>
              <strong>User:</strong> {viewReview.userId.name}
            </p>
            <p>
              <strong>Rating:</strong> {getStarIcons(viewReview.rating)}
            </p>
            <p>
              <strong>Comment:</strong> {viewReview.comment || "No comment"}
            </p>
            <p>
              <strong>Date:</strong> {new Date(viewReview.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AllReviews;

