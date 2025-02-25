import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalType, setModalType] = useState(""); // "edit" or "delete"
  const [newFeedback, setNewFeedback] = useState({
    rating: 5,
    comment: "",
  });

  // Fetch all feedbacks given by the user
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosInstance.get("/ratings/user");
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        toast.error("Failed to fetch feedbacks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  // Handle opening the modal for editing feedback
  const handleEditFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setNewFeedback({
      rating: feedback.rating,
      comment: feedback.comment,
    });
    setModalType("edit");
    setModalOpen(true);
  };

  // Handle opening the modal for deleting feedback
  const handleDeleteFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setModalType("delete");
    setModalOpen(true);
  };

  // Submit updated feedback
  const confirmEditFeedback = async () => {
    if (!newFeedback.comment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/ratings/${selectedFeedback._id}`,
        newFeedback
      );
      console.log("Updated feedback response:", response.data);

      // Update the feedbacks state with the updated feedback
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((fb) =>
          fb._id === selectedFeedback._id
            ? { ...fb, ...response.data.feedback }
            : fb
        )
      );

      toast.success("Feedback updated successfully!");
    } catch (error) {
      console.error("Error updating feedback:", error);
      toast.error("Failed to update feedback. Please try again.");
    } finally {
      closeModal();
    }
  };

  // Confirm deletion of feedback
  const confirmDeleteFeedback = async () => {
    try {
      await axiosInstance.patch(`/ratings/${selectedFeedback._id}`);
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((fb) => fb._id !== selectedFeedback._id)
      );
      toast.success("Feedback deleted successfully!");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback. Please try again.");
    } finally {
      closeModal();
    }
  };

  // Close modal and reset state
  const closeModal = () => {
    setModalOpen(false);
    setSelectedFeedback(null);
    setNewFeedback({ rating: 5, comment: "" });
  };

  return (
    <div className="py-4 px-44 bg-green-pale">
      <h1 className="text-2xl font-bold mt-20 mb-4">My Feedbacks</h1>
      {loading ? (
        <p>Loading...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="border p-4 rounded-lg shadow-sm grid grid-cols-2 bg-white-default">
              {/* Provider Image and Name */}
              {/* <div className="flex bg-fuchsia-300"> */}
              <div className="flex flex-col space-x-4 mb-2">
                <div className="flex space-x-4">
                <img
                  src={feedback.providerId?.image || "no profile image"}
                  alt={`${feedback.providerId?.name}'s profile`}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold mt-3 text-xl">
                    {feedback.providerId?.name || "Unknown Provider"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Reviewed on{" "}
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <p className="flex items-center mt-3">
                <span className="mr-2 -ml-3">Rating:</span>
                <span>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      key={value}
                      className={`text-xl ${
                        value <= feedback.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </span>
              </p>
              <p>
                <span className="mr-1 -ml-3">Comment:</span>
                
                {feedback.comment || "No comment provided."}
                
              </p>
             </div>
              {/* Edit and Delete Buttons */}
              
              <div className="flex flex-col items-end justify-center">
                <button
                  onClick={() => handleEditFeedback(feedback)}
                  className="bg-blue-500 hover:bg-blue-600 text-white-default px-5 py-1 rounded mb-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteFeedback(feedback)}
                  className="bg-red-500 hover:bg-red-600 text-white-default px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
              
            </div>
          ))}
        </div>
      )}

      {/* Modal for Editing or Deleting Feedback */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black-default opacity-50"></div>
          <div className="relative z-50 bg-white-default p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "edit" ? "Edit Feedback" : "Delete Feedback"}
            </h2>
            <p className="mb-4">
              {modalType === "edit"
                ? "Update your feedback below."
                : "Are you sure you want to delete this feedback?"}
            </p>

            {/* Edit Feedback Form */}
            {modalType === "edit" && (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setNewFeedback({ ...newFeedback, rating: value })
                        }
                        className={`text-3xl ${
                          value <= newFeedback.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } focus:outline-none`}
                        aria-label={`${value} Star${value > 1 ? "s" : ""}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comment
                  </label>
                  <textarea
                    value={newFeedback.comment}
                    onChange={(e) =>
                      setNewFeedback({
                        ...newFeedback,
                        comment: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="3"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmEditFeedback}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Delete Confirmation Buttons */}
            {modalType === "delete" && (
              <div className="flex justify-center space-x-2 bg-white-default">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteFeedback}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes, Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedbacks;
