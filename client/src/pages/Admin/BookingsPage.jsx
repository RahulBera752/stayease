import { useEffect, useState } from "react";
import {
  Search,
  CalendarDays,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  BadgeCheck,
  CreditCard,
  Hotel,
  Users,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const BookingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Helper to strictly clean and format status strings
  const normalizeStatus = (status) => {
    if (!status) return "pending";
    return String(status).trim().toLowerCase();
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/bookings");

      const bookingList =
        data.bookings || data.data || (Array.isArray(data) ? data : []);
      
      setBookings(bookingList);

      // If a modal is open, sync it with the newly fetched data
      if (selectedBooking) {
        const updatedSelection = bookingList.find(
          (b) => b._id === selectedBooking._id
        );
        if (updatedSelection) {
          setSelectedBooking(updatedSelection);
        }
      }
    } catch (err) {
      console.error("Fetch Bookings Error:", err);
      toast.error(
        err.response?.data?.message || "Failed to load bookings from server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBookingAmount = (booking) => {
    if (!booking) return 0;
    return (
      booking.grandTotal ??
      booking.totalAmount ??
      booking.finalAmount ??
      booking.totalPrice ??
      booking.amount ??
      0
    );
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      // Send the status to the backend
      const { data } = await api.put(`/bookings/${id}/status`, {
        status: newStatus, 
      });

      toast.success(data?.message || `Booking status updated to ${newStatus}`);

      // Update locally in bookings list immediately (using bookingStatus)
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, bookingStatus: newStatus } : b))
      );

      // Update selected booking inside modal immediately
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking((prev) => ({ ...prev, bookingStatus: newStatus }));
      }
    } catch (err) {
      console.error("Status Update Error:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const guest = booking.fullName || booking.user?.name || "";
    const email = booking.email || booking.user?.email || "";
    const hotel = booking.hotel?.name || "";
    const bookingId = booking.bookingId || booking._id || "";

    const searchLower = search.toLowerCase();

    return (
      guest.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      hotel.toLowerCase().includes(searchLower) ||
      bookingId.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 mt-2">Manage hotel reservations.</p>
        </div>

        <button
          onClick={fetchBookings}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition shadow"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Booking ID, Guest Name, Email, or Hotel..."
            className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-5">Booking ID</th>
                <th className="p-5">Guest</th>
                <th className="p-5">Hotel</th>
                <th className="p-5 text-center">Check In</th>
                <th className="p-5 text-center">Check Out</th>
                <th className="p-5 text-center">Amount</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const displayId =
                    booking.bookingId || `#${booking._id?.slice(-8)}`;
                  const guestName =
                    booking.fullName || booking.user?.name || "N/A";
                  const guestEmail =
                    booking.email || booking.user?.email || "N/A";
                  
                  // READS bookingStatus INSTED OF status
                  const currentStatus = normalizeStatus(booking.bookingStatus);

                  return (
                    <tr
                      key={booking._id}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="p-5 font-mono text-xs font-semibold text-indigo-600">
                        <span className="bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
                          {displayId}
                        </span>
                      </td>

                      <td className="p-5">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {guestName}
                          </h3>
                          <p className="text-gray-500 text-xs">{guestEmail}</p>
                        </div>
                      </td>

                      <td className="p-5 font-medium text-gray-800">
                        {booking.hotel?.name || "N/A"}
                      </td>

                      <td className="p-5 text-center whitespace-nowrap text-gray-600">
                        <div className="flex items-center justify-center gap-1.5">
                          <CalendarDays
                            size={14}
                            className="text-indigo-500"
                          />
                          {booking.checkIn
                            ? new Date(booking.checkIn).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>

                      <td className="p-5 text-center whitespace-nowrap text-gray-600">
                        {booking.checkOut
                          ? new Date(booking.checkOut).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="p-5 text-center font-bold text-indigo-600">
                        ₹{getBookingAmount(booking)}
                      </td>

                      <td className="p-5 text-center">
                        {currentStatus === "confirmed" ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            <CheckCircle size={14} /> Confirmed
                          </span>
                        ) : currentStatus === "cancelled" ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                            <XCircle size={14} /> Cancelled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                            <Clock size={14} /> Pending
                          </span>
                        )}
                      </td>

                      <td className="p-5 text-center">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-indigo-50 hover:bg-indigo-100 p-2.5 rounded-xl transition text-indigo-600"
                          title="View Full Booking Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden text-gray-800 my-8">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider">
                  Reservation Details
                </span>
                <h2 className="text-xl font-bold font-mono mt-0.5">
                  ID: {selectedBooking.bookingId || selectedBooking._id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Hotel Information */}
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-indigo-900 text-lg">
                    {selectedBooking.hotel?.name || "Hotel Details"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedBooking.hotel?.location || "Location N/A"}
                  </p>
                </div>
                <span className="text-lg font-bold text-indigo-600">
                  ₹{getBookingAmount(selectedBooking)}
                </span>
              </div>

              {/* Guest Information */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider text-slate-500">
                  Guest Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border">
                  <div className="flex items-center gap-3">
                    <User className="text-indigo-500" size={18} />
                    <div>
                      <p className="text-xs text-gray-400">Full Name</p>
                      <p className="font-medium">
                        {selectedBooking.fullName ||
                          selectedBooking.user?.name ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-indigo-500" size={18} />
                    <div>
                      <p className="text-xs text-gray-400">Mobile Number</p>
                      <p className="font-medium">
                        {selectedBooking.mobile || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="text-indigo-500" size={18} />
                    <div>
                      <p className="text-xs text-gray-400">Email Address</p>
                      <p className="font-medium break-all">
                        {selectedBooking.email ||
                          selectedBooking.user?.email ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BadgeCheck className="text-indigo-500" size={18} />
                    <div>
                      <p className="text-xs text-gray-400">Aadhaar Status</p>
                      <p className="font-medium font-mono text-gray-600">
                        {selectedBooking.aadhar ? "[Provided]" : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:col-span-2 mt-1">
                    <MapPin className="text-indigo-500 mt-1" size={18} />
                    <div>
                      <p className="text-xs text-gray-400">Full Address</p>
                      <p className="font-medium">
                        {selectedBooking.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stay & Payment Details */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider text-slate-500">
                  Stay & Billing
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl border text-center">
                    <CalendarDays
                      className="mx-auto text-indigo-500 mb-1"
                      size={18}
                    />
                    <p className="text-xs text-gray-400">Check In</p>
                    <p className="font-semibold text-xs">
                      {selectedBooking.checkIn
                        ? new Date(
                            selectedBooking.checkIn
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border text-center">
                    <CalendarDays
                      className="mx-auto text-indigo-500 mb-1"
                      size={18}
                    />
                    <p className="text-xs text-gray-400">Check Out</p>
                    <p className="font-semibold text-xs">
                      {selectedBooking.checkOut
                        ? new Date(
                            selectedBooking.checkOut
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border text-center">
                    <Hotel
                      className="mx-auto text-indigo-500 mb-1"
                      size={18}
                    />
                    <p className="text-xs text-gray-400">Rooms</p>
                    <p className="font-semibold">
                      {selectedBooking.rooms || 1}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border text-center">
                    <Users
                      className="mx-auto text-indigo-500 mb-1"
                      size={18}
                    />
                    <p className="text-xs text-gray-400">Guests</p>
                    <p className="font-semibold">
                      {selectedBooking.guests || 1}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <CreditCard size={15} />
                    {selectedBooking.paymentMethod || "Cash"}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">
                    ₹{getBookingAmount(selectedBooking)}
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wider text-slate-500">
                  Update Booking Status
                </h4>

                {normalizeStatus(selectedBooking.bookingStatus) === "confirmed" || 
                 normalizeStatus(selectedBooking.bookingStatus) === "cancelled" ||
                 normalizeStatus(selectedBooking.bookingStatus) === "checked-in" ||
                 normalizeStatus(selectedBooking.bookingStatus) === "checked-out" ? (
                  <div className="flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl text-gray-600 font-medium border border-gray-200">
                    <Lock size={16} />
                    <span>
                      Booking is already{" "}
                      <strong className="capitalize text-gray-900">
                        {normalizeStatus(selectedBooking.bookingStatus)}
                      </strong>{" "}
                      (Decision locked)
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      disabled={updatingId === selectedBooking._id}
                      onClick={() =>
                        handleStatusUpdate(selectedBooking._id, "confirmed")
                      }
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      <CheckCircle size={18} />
                      Confirm Booking
                    </button>

                    <button
                      disabled={updatingId === selectedBooking._id}
                      onClick={() =>
                        handleStatusUpdate(selectedBooking._id, "cancelled")
                      }
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;