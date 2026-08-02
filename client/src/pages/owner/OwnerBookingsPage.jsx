import React, { useEffect, useState } from "react";
import { RefreshCw, Search, Calendar, User, Building2 } from "lucide-react";
import toast from "react-hot-toast";

// 1. Use standard configured API service
import api from "../../services/api";

const OwnerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookings/owner-bookings");

      if (response.data?.success) {
        setBookings(response.data.bookings || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
      });

      if (response.data?.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Property Bookings</h1>
          <p className="text-sm text-slate-400 mt-1">
            View and manage reservations for your listed properties.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMyBookings}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 transition text-sm font-medium cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-slate-400" : "text-slate-400"} />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by guest name, hotel, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="text-lg font-semibold text-white">No bookings found</p>
            <p className="text-sm">You have no guest reservations at this time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Booking ID</th>
                  <th className="py-4 px-6">Hotel</th>
                  <th className="py-4 px-6">Guest</th>
                  <th className="py-4 px-6">Dates</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm text-slate-300">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">
                      #{booking._id.slice(-6)}
                    </td>
                    <td className="py-4 px-6 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-indigo-400" />
                        <span>{booking.hotel?.name || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-slate-400" />
                        <div>
                          <p className="font-medium text-white">{booking.user?.name || "Guest"}</p>
                          <p className="text-xs text-slate-400">{booking.user?.email || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Calendar size={14} className="text-slate-400" />
                        <span>
                          {formatDate(booking.checkInDate || booking.checkIn)} -{" "}
                          {formatDate(booking.checkOutDate || booking.checkOut)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-indigo-400">
                      ₹{booking.totalPrice ?? booking.totalAmount ?? 0}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${
                          booking.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : booking.status === "cancelled"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : booking.status === "completed"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className="text-xs border border-slate-700 rounded-lg px-2.5 py-1.5 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="pending" className="bg-slate-900 text-white">Pending</option>
                        <option value="confirmed" className="bg-slate-900 text-white">Confirmed</option>
                        <option value="cancelled" className="bg-slate-900 text-white">Cancelled</option>
                        <option value="completed" className="bg-slate-900 text-white">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookingsPage;