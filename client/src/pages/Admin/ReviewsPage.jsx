import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;

      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
        withCredentials: true,
      };

      const { data } = await axios.get("/api/reviews/admin", config);
      setReviews(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;

      await axios.delete(`/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
        withCredentials: true,
      });

      setReviews((prev) => prev.filter((rev) => rev._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete review");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
          <p className="text-gray-500 text-sm">
            Monitor and manage guest feedback across all hotels.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading reviews...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No reviews available.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Hotel</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {reviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{rev.user?.name || "Guest"}</div>
                    <div className="text-xs text-gray-500">{rev.user?.email}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-indigo-600">
                    {rev.hotel?.name || rev.hotel?.nameOfHotel || "Hotel"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-yellow-500 font-bold">{"★".repeat(rev.rating)}</span>
                    <span className="text-gray-300">{"★".repeat(5 - rev.rating)}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{rev.comment}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {new Date(rev.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;