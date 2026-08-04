import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  TicketPercent,
  BadgeCheck,
  Users,
  Hotel,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Wallet,
  Globe,
} from "lucide-react";

// Verhoeff Algorithm for 12-digit Identity Validation
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 1, 2, 3, 4],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const validateIdentityChecksum = (numStr) => {
  if (!numStr || !/^\d{12}$/.test(numStr)) return false;
  let c = 0;
  const invertedArray = numStr.split("").reverse().map(Number);
  for (let i = 0; i < invertedArray.length; i++) {
    c = d[c][p[i % 8][invertedArray[i]]];
  }
  return c === 0;
};

// Script loader preventing duplicate injections
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existingScript = document.getElementById("razorpay-sdk");
    if (existingScript) {
      existingScript.onload = () => resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BookingPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Retrieve booking data with localStorage fallback
  const bookingData = useMemo(() => {
    if (state && state.hotel) {
      localStorage.setItem("stayEaseBooking", JSON.stringify(state));
      return state;
    }
    const saved = localStorage.getItem("stayEaseBooking");
    return saved ? JSON.parse(saved) : null;
  }, [state]);

  if (!bookingData || !bookingData.hotel) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center px-4 text-white text-center">
        <h1 className="text-4xl font-bold">Booking information not found</h1>
        <p className="text-slate-400 mt-2">Please select a hotel from the home page to proceed with booking.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 rounded-xl bg-cyan-500 font-semibold hover:bg-cyan-600 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const { hotel, checkIn = "", checkOut = "", guests = 1 } = bookingData;

  // Safe location helper
  const getHotelLocation = () => {
    if (!hotel) return "";
    if (typeof hotel.location === "string") return hotel.location;
    if (hotel.location && typeof hotel.location === "object") {
      return hotel.city || hotel.address || "";
    }
    return hotel.city || hotel.address || "";
  };

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");

  const [rooms, setRooms] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // "Cash" or "Online"

  const [bookingSuccessData, setBookingSuccessData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DST-safe night calculation
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? 1 : Math.max(1, diffDays);
  }, [checkIn, checkOut]);

  const subtotal = (hotel?.pricePerNight || hotel?.price || 0) * nights * rooms;
  const gst = Math.round(subtotal * 0.18);
  const discountAmount = Math.round(subtotal * (discount / 100));
  const finalPrice = Math.max(0, subtotal - discountAmount + gst);

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const { data } = await api.post("/coupons/validate", { code: coupon.trim() });
      
      const discountPercentage = data?.data?.discountPercentage || 0;
      const validCode = data?.data?.code || coupon;

      setDiscount(discountPercentage);
      setAppliedCouponCode(validCode);
      toast.success(`Coupon ${validCode} Applied! ${discountPercentage}% OFF`);
    } catch (err) {
      setDiscount(0);
      setAppliedCouponCode("");
      toast.error(err.response?.data?.message || "Invalid or expired coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setAppliedCouponCode("");
    setDiscount(0);
    toast.success("Coupon removed");
  };

  const generateBookingId = () => {
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `SE-${randomHex}`;
  };

  const handleBooking = async () => {
    if (!fullName.trim() || !mobile.trim() || !address.trim() || !aadhar.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!validateIdentityChecksum(aadhar)) {
      toast.error("Enter a valid 12-digit identity number.");
      return;
    }

    const bookingId = generateBookingId();
    setIsSubmitting(true);

    try {
      if (paymentMethod === "Online") {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Razorpay SDK failed to load. Check your internet connection.");
          setIsSubmitting(false);
          return;
        }

        // 1. Create Order on Backend
        const { data } = await api.post("/payments/create-order", {
          amount: finalPrice,
          bookingId: bookingId,
        });

        if (!data || !data.order || !data.order.id) {
          toast.error("Failed to create Razorpay order from server.");
          setIsSubmitting(false);
          return;
        }

        const razorpayKey =
          import.meta.env.VITE_RAZORPAY_KEY_ID ||
          import.meta.env.VITE_RAZORPAY_KEY ||
          "rzp_test_TLkVUaNPhDqIaY";

        const options = {
          key: razorpayKey,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "StayEase Hotels",
          description: `Booking for ${hotel?.name || "Hotel"}`,
          order_id: data.order.id,
          handler: async function (response) {
            try {
              const bookingRes = await api.post("/bookings", {
                bookingId,
                hotelId: hotel?._id,
                fullName,
                mobile,
                email,
                address,
                aadhar,
                checkIn,
                checkOut,
                guests,
                rooms,
                nights,
                couponCode: appliedCouponCode,
                discount,
                subtotal,
                totalPrice: finalPrice,
                paymentMethod: "Online",
                paymentDetails: {
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                },
              });

              setBookingSuccessData({
                bookingId: bookingRes.data?.bookingId || bookingId,
                totalPrice: finalPrice,
                paymentMethod: "Online (Razorpay)",
                paymentId: response.razorpay_payment_id,
              });
              toast.success("Payment & Booking Successful!");
            } catch (err) {
              console.error("Booking save failed:", err.response?.data || err.message);
              toast.error(err.response?.data?.message || "Payment received, but failed to save booking to database.");
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: mobile,
          },
          theme: {
            color: "#06b6d4",
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              toast.error("Payment Cancelled");
            },
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        return;
      }

      // Direct Booking (Cash)
      const { data } = await api.post("/bookings", {
        bookingId,
        hotelId: hotel?._id,
        fullName,
        mobile,
        email,
        address,
        aadhar,
        checkIn,
        checkOut,
        guests,
        rooms,
        nights,
        couponCode: appliedCouponCode,
        discount,
        subtotal,
        totalPrice: finalPrice,
        paymentMethod: "Cash",
      });

      setBookingSuccessData({
        bookingId: data?.bookingId || bookingId,
        totalPrice: finalPrice,
        paymentMethod: "Cash",
      });

      toast.success("Booking Successful!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Booking Failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Booking ID copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black mb-2"
        >
          Complete Your Booking
        </motion.h1>

        <p className="text-slate-400 mb-10">
          Secure your luxury stay in just one step.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* Guest Information */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
            >
              <h2 className="text-3xl font-bold mb-8">Guest Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-slate-300 mb-2 block">
                    Full Name *
                  </label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-cyan-400 transition">
                    <User className="text-cyan-400 shrink-0" />
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Rahul Bera"
                      className="bg-transparent w-full p-4 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 mb-2 block">
                    Mobile Number *
                  </label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-cyan-400 transition">
                    <Phone className="text-cyan-400 shrink-0" />
                    <input
                      value={mobile}
                      maxLength={10}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="bg-transparent w-full p-4 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 mb-2 block">Email</label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-cyan-400 transition">
                    <Mail className="text-cyan-400 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@gmail.com"
                      className="bg-transparent w-full p-4 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 mb-2 block">
                    Identity Document Number *
                  </label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-cyan-400 transition">
                    <BadgeCheck className="text-cyan-400 shrink-0" />
                    <input
                      value={aadhar}
                      maxLength={12}
                      onChange={(e) => setAadhar(e.target.value.replace(/\D/g, ""))}
                      placeholder="12-Digit Document No."
                      className="bg-transparent w-full p-4 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-slate-300 mb-2 block">
                  Full Address *
                </label>
                <div className="flex items-start bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-cyan-400 transition">
                  <MapPin className="mt-4 text-cyan-400 shrink-0" />
                  <textarea
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete address"
                    className="bg-transparent w-full p-4 outline-none resize-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Booking Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
            >
              <h2 className="text-3xl font-bold mb-8">Booking Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-slate-300">Check In</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
                    <Calendar className="text-cyan-400 shrink-0" />
                    <input
                      type="date"
                      value={checkIn}
                      readOnly
                      className="bg-transparent p-4 w-full outline-none text-slate-300 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-slate-300">Check Out</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
                    <Calendar className="text-cyan-400 shrink-0" />
                    <input
                      type="date"
                      value={checkOut}
                      readOnly
                      className="bg-transparent p-4 w-full outline-none text-slate-300 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-slate-300">Guests</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
                    <Users className="text-cyan-400 shrink-0" />
                    <input
                      value={guests}
                      readOnly
                      className="bg-transparent p-4 w-full outline-none text-slate-300 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-slate-300">Rooms</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 focus-within:border-cyan-400 transition">
                    <Hotel className="text-cyan-400 shrink-0" />
                    <input
                      type="number"
                      min={1}
                      value={rooms}
                      onChange={(e) => setRooms(Math.max(1, Number(e.target.value)))}
                      className="bg-transparent p-4 w-full outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Offers & Coupon */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
            >
              <h2 className="text-3xl font-bold mb-6">Offers & Coupon</h2>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <TicketPercent
                    size={20}
                    className="absolute left-5 top-5 text-cyan-400"
                  />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 outline-none uppercase focus:border-cyan-400 transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={isApplyingCoupon}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-105 transition disabled:opacity-50"
                >
                  {isApplyingCoupon ? "Checking..." : "Apply"}
                </button>
              </div>

              {discount > 0 && (
                <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-400 shrink-0" />
                    <div>
                      <h3 className="font-bold text-green-400">
                        Coupon Applied ({appliedCouponCode})
                      </h3>
                      <p className="text-sm text-slate-300">
                        You get {discount}% OFF on your booking subtotal!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-bold text-red-400 hover:underline px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20"
                  >
                    Remove
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT SIDE / SUMMARY */}
          <div className="lg:sticky lg:top-28 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <img
                src={
                  hotel?.images?.[0]?.url ||
                  hotel?.images?.[0] ||
                  hotel?.thumbnail?.url ||
                  hotel?.thumbnail ||
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                }
                alt={hotel?.name || "Hotel"}
                className="h-64 w-full object-cover"
              />

              <div className="p-7">
                <h2 className="text-3xl font-bold">Booking Summary</h2>
                <h3 className="mt-4 text-xl font-semibold">{hotel?.name || "Luxury Hotel"}</h3>
                <p className="text-slate-400">{getHotelLocation()}</p>

                <div className="mt-8 space-y-5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Price / Night</span>
                    <span>₹{hotel?.pricePerNight || hotel?.price || 0}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Nights</span>
                    <span>{nights}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Rooms</span>
                    <span>{rooms}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Guests</span>
                    <span>{guests}</span>
                  </div>

                  <hr className="border-white/10" />

                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">GST (18%)</span>
                    <span>₹{gst}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({discount}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-3xl font-bold pt-2">
                    <span>Total</span>
                    <span className="text-cyan-400">₹{finalPrice}</span>
                  </div>
                </div>

                <h3 className="mt-10 mb-5 text-xl font-bold">
                  Payment Method
                </h3>

                {/* Cash & Online Payment Options */}
                <div className="grid gap-3">
                  {[
                    { id: "Cash", label: "Cash", icon: Wallet },
                    { id: "Online", label: "Online (Razorpay)", icon: Globe },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPaymentMethod(item.id)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          paymentMethod === item.id
                            ? "border-cyan-400 bg-cyan-500/20"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent className="text-cyan-400" />
                            <span>{item.label}</span>
                          </div>
                          {paymentMethod === item.id && (
                            <div className="h-3 w-3 rounded-full bg-cyan-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleBooking}
                  disabled={isSubmitting}
                  type="button"
                  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-4 text-lg font-bold shadow-2xl hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </button>

                <p className="mt-5 text-center text-xs text-slate-400">
                  Your payment is secured using encrypted checkout.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* BOOKING SUCCESS OVERLAY */}
      <AnimatePresence>
        {bookingSuccessData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-xl w-full bg-[#0b1120] border border-white/10 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 to-green-500" />

              <div className="text-center space-y-3 mt-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 mb-2">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  Booking Confirmed!
                </h2>
                <p className="text-slate-400 text-sm">
                  We look forward to welcoming you to {hotel?.name || "our hotel"}
                </p>
              </div>

              {/* BOOKING ID BANNER */}
              <div className="my-6 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold block">
                    Booking Reference ID
                  </span>
                  <span className="text-xl font-mono font-bold text-cyan-400">
                    {bookingSuccessData.bookingId}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(bookingSuccessData.bookingId)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-slate-300"
                  title="Copy ID"
                >
                  <Copy size={18} />
                </button>
              </div>

              {/* BOOKING DETAILS RECEIPT */}
              <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5 text-sm">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">Guest Name</span>
                  <span className="font-medium text-white">{fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">Hotel</span>
                  <span className="font-medium text-white">{hotel?.name || "Hotel"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">Dates</span>
                  <span className="font-medium text-white">
                    {checkIn} to {checkOut} ({nights} Night{nights > 1 ? "s" : ""})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">Payment Method</span>
                  <span className="font-medium text-cyan-400">
                    {bookingSuccessData.paymentMethod}
                  </span>
                </div>
                {bookingSuccessData.paymentId && (
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-slate-400">Razorpay Key / Payment ID</span>
                    <span className="font-mono text-xs text-slate-300">
                      {bookingSuccessData.paymentId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1 pt-2 font-bold text-base">
                  <span className="text-slate-300">Total Paid</span>
                  <span className="text-green-400 text-lg">
                    ₹{bookingSuccessData.totalPrice}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold hover:scale-[1.02] transition flex items-center justify-center gap-2"
                >
                  Go to My Bookings
                  <ExternalLink size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;