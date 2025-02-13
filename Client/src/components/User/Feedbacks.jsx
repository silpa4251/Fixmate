import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import Modal from "../Modal";

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
    try {
      const response = await axiosInstance.put(`/ratings/${selectedFeedback._id}`, newFeedback);
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((fb) =>
          fb._id === selectedFeedback._id ? { ...fb, ...response.data.rating } : fb
        )
      );
      toast.success("Feedback updated successfully!");
    } catch (error) {
      console.error("Error updating feedback:", error);
      toast.error("Failed to update feedback. Please try again.");
    } finally {
      setModalOpen(false);
    }
  };

  // Confirm deletion of feedback
  const confirmDeleteFeedback = async () => {
    try {
      await axiosInstance.delete(`/ratings/${selectedFeedback._id}`);
      setFeedbacks((prevFeedbacks) => prevFeedbacks.filter((fb) => fb._id !== selectedFeedback._id));
      toast.success("Feedback deleted successfully!");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback. Please try again.");
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Feedback</h1>
      {loading ? (
        <p>Loading...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="border p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold">{feedback.bookingId?.service || "Service"}</h3>
              <p>Rating: {feedback.rating}/5</p>
              <p>Comment: {feedback.comment || "No comment provided."}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEditFeedback(feedback)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteFeedback(feedback)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Editing or Deleting Feedback */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === "edit" ? "Edit Feedback" : "Delete Feedback"}
        message={
          modalType === "edit"
            ? "Update your feedback below."
            : "Are you sure you want to delete this feedback?"
        }
        confirmText={modalType === "edit" ? "Save Changes" : "Yes, Delete"}
        cancelText="Cancel"
        onConfirm={modalType === "edit" ? confirmEditFeedback : confirmDeleteFeedback}
      >
        {modalType === "edit" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Rating</label>
              <select
                value={newFeedback.rating}
                onChange={(e) => setNewFeedback({ ...newFeedback, rating: Number(e.target.value) })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Comment</label>
              <textarea
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Feedbacks;