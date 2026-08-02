import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import ReportModal from "../components/admin/ReportModal";
import {
  MapPin,
  Ticket,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  MessageSquarePlus,
  AlertCircle,
  X,
} from "lucide-react";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Reviews
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Modal State for Reports
  const [selectedBookingForReport, setSelectedBookingForReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const fetchMyBookings = async () => {
    try {
      const response = await api.get("/bookings/my-bookings");

      // Handle variations in API response structures safely
      const rawData = response.data;
      let bookingsArray = [];

      if (Array.isArray(rawData)) {
        bookingsArray = rawData;
      } else if (Array.isArray(rawData?.bookings)) {
        bookingsArray = rawData.bookings;
      } else if (Array.isArray(rawData?.data)) {
        bookingsArray = rawData.data;
      }

      setBookings(bookingsArray);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      toast.error("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a short review message.");
      return;
    }

    try {
      setSubmitting(true);
      const hotelId =
        selectedBooking.hotel?._id || selectedBooking.hotelId || selectedBooking.hotel;

      await api.post("/reviews", {
        hotelId,
        bookingId: selectedBooking._id || selectedBooking.bookingId,
        rating,
        comment,
      });

      toast.success("Thank you! Your review has been submitted.");

      // Update local booking state to mark as reviewed
      setBookings((prev) =>
        prev.map((b) =>
          (b._id || b.bookingId) === (selectedBooking._id || selectedBooking.bookingId)
            ? { ...b, isReviewed: true }
            : b
        )
      );

      // Close modal
      setSelectedBooking(null);
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Submit Review Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit review. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle opening the report modal
  const handleOpenReport = (booking) => {
    setSelectedBookingForReport(booking);
    setIsReportModalOpen(true);
  };

  // Helper to check if trip is finished
  const isTripCompleted = (checkOutDateStr, status) => {
    const isConfirmed =
      status?.toLowerCase() === "confirmed" || status?.toLowerCase() === "completed";
    if (!isConfirmed) return false;

    const checkOut = new Date(checkOutDateStr);
    const now = new Date();
    return checkOut <= now;
  };

  // Dynamic Status Badge Helper
  const renderStatusBadge = (status) => {
    const statusLower = (status || "pending").toLowerCase();

    switch (statusLower) {
      case "confirmed":
      case "completed":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1 capitalize">
            <CheckCircle className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case "cancelled":
      case "canceled":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 capitalize">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      case "pending":
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 capitalize">
            <Clock className="w-3.5 h-3.5" /> Pending Approval
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-slate-300">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2">My Bookings</h1>
        <p className="text-slate-400 mb-8">
          View and track your hotel reservations.
        </p>

        {!Array.isArray(bookings) || bookings.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <Ticket className="mx-auto h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Bookings Found</h3>
            <p className="text-slate-400">
              You haven't made any hotel reservations yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const hotelName =
                booking.hotel?.name || booking.hotelName || "Hotel Stay";
              const hotelLocation =
                booking.hotel?.location ||
                booking.location ||
                "Location unavailable";
              const image =
                booking.hotel?.images?.[0]?.url ||
                booking.hotel?.images?.[0] ||
                booking.hotel?.thumbnail ||
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80";

              const completed = isTripCompleted(
                booking.checkOut,
                booking.status || booking.bookingStatus
              );

              return (
                <div
                  key={booking._id || booking.bookingId || Math.random()}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden flex flex-col md:flex-row hover:border-white/20 transition"
                >
                  <img
                    src={image}
                    alt={hotelName}
                    className="w-full md:w-64 h-48 md:h-auto object-cover"
                  />

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h2 className="text-2xl font-bold">{hotelName}</h2>
                        {/* Dynamic Status Display */}
                        {renderStatusBadge(booking.status || booking.bookingStatus)}
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <span>{hotelLocation}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-sm mb-4">
                        <div>
                          <span className="text-xs text-slate-400 block mb-1">
                            Booking ID
                          </span>
                          <span className="font-mono font-bold text-cyan-400">
                            {booking.bookingId || booking._id}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block mb-1">
                            Check In
                          </span>
                          <span className="font-medium text-slate-200">
                            {booking.checkIn || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block mb-1">
                            Check Out
                          </span>
                          <span className="font-medium text-slate-200">
                            {booking.checkOut || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-slate-400 text-sm">
                          Payment:{" "}
                          <span className="text-slate-200 font-medium">
                            {booking.paymentMethod || "N/A"}
                          </span>
                        </span>

                        {/* Leave Review Button */}
                        {completed && (
                          booking.isReviewed ? (
                            <span className="text-xs font-semibold px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Reviewed
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                            >
                              <MessageSquarePlus className="w-4 h-4" /> Write Review
                            </button>
                          )
                        )}

                        {/* Report Issue Button */}
                        {completed && (
                          <button
                            onClick={() => handleOpenReport(booking)}
                            className="px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition flex items-center gap-1.5"
                          >
                            <AlertCircle className="w-3.5 h-3.5" /> Report Issue
                          </button>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-cyan-400">
                          ₹{booking.totalPrice || booking.amount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- REVIEW MODAL --- */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#0b1329] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-white mb-1">Leave a Review</h2>
              <p className="text-slate-400 text-xs mb-6">
                Share your experience at{" "}
                <span className="text-cyan-400 font-medium">
                  {selectedBooking.hotel?.name || selectedBooking.hotelName}
                </span>
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating Stars */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text Area */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the service, room condition, and staff..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- REPORT MODAL --- */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          booking={selectedBookingForReport}
        />
      </div>
    </div>
  );
};

export default MyBookingsPage;