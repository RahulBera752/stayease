import asyncHandler from "express-async-handler";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Get Admin Dashboard Statistics & Analytics (Full Year Jan to Dec Timeline)
|--------------------------------------------------------------------------
*/
export const getAdminDashboard = asyncHandler(async (req, res) => {
  // 1. Core Statistics Counts
  const totalHotels = await Hotel.countDocuments().catch(() => 0);
  const activeHotels = await Hotel.countDocuments({ status: "active" }).catch(() => 0);
  const featuredHotels = await Hotel.countDocuments({ featured: true }).catch(() => 0);
  const luxuryHotels = await Hotel.countDocuments({ luxury: true }).catch(() => 0);

  const totalUsers = await User.countDocuments().catch(() => 0);
  const totalAdmins = await User.countDocuments({ role: "admin" }).catch(() => 0);

  // Fetch all bookings safely
  const allBookings = await Booking.find({}).lean().catch(() => []);
  const totalBookings = allBookings.length;

  const getBookingStatus = (b) => {
    const raw = b.status || b.bookingStatus || b.state || "Pending";
    return String(raw).trim();
  };

  const confirmedBookingsList = allBookings.filter(b => {
    const status = getBookingStatus(b).toLowerCase();
    return status.includes("confirm") || status.includes("complet") || status.includes("success") || status.includes("paid") || status.includes("approved");
  });
  const confirmedBookings = confirmedBookingsList.length > 0 ? confirmedBookingsList.length : totalBookings;

  // Calculate Total Revenue
  let totalRevenue = 0;
  confirmedBookingsList.forEach(b => {
    const price = Number(b.totalPrice || b.price || b.amount || b.cost || 0);
    if (!isNaN(price)) totalRevenue += price;
  });

  // Generate revenue data for the full year from January (0) to December (11)
  const revenueData = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();

  for (let m = 0; m <= 11; m++) {
    const monthKey = `${monthNames[m]} ${currentYear}`;
    
    let monthRev = 0;
    confirmedBookingsList.forEach(b => {
      const bookingDate = new Date(b.createdAt || b.date || Date.now());
      if (bookingDate.getMonth() === m && bookingDate.getFullYear() === currentYear) {
        const price = Number(b.totalPrice || b.price || b.amount || b.cost || 0);
        if (!isNaN(price)) monthRev += price;
      }
    });

    revenueData.push({
      month: monthKey,
      revenue: monthRev
    });
  }

  // 2. Booking Status Breakdown for Pie Chart
  const statusCounts = {};
  allBookings.forEach(b => {
    const status = getBookingStatus(b);
    const capitalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    statusCounts[capitalized] = (statusCounts[capitalized] || 0) + 1;
  });

  const bookingStatus = Object.entries(statusCounts).map(([status, count]) => ({
    _id: status,
    count: count
  }));

  // 3. Top 5 Performing Hotels
  const hotelBookingCounts = {};
  const activeConfirmedList = confirmedBookingsList.length > 0 ? confirmedBookingsList : allBookings;
  
  activeConfirmedList.forEach(b => {
    let hotelRef = b.hotel || b.hotelId || b.hotel_id || b.property || b.listing;
    let hotelIdStr = "";
    if (hotelRef) {
      hotelIdStr = (typeof hotelRef === "object" && hotelRef._id) ? hotelRef._id.toString() : hotelRef.toString();
    }
    if (hotelIdStr) {
      hotelBookingCounts[hotelIdStr] = (hotelBookingCounts[hotelIdStr] || 0) + 1;
    }
  });

  const sortedHotels = Object.entries(hotelBookingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topHotels = [];
  for (const [hotelId, count] of sortedHotels) {
    try {
      let hotelDoc = null;
      if (mongoose.Types.ObjectId.isValid(hotelId)) {
        hotelDoc = await Hotel.findById(hotelId).lean();
      }
      topHotels.push({
        _id: hotelDoc?._id || hotelId,
        name: hotelDoc?.name || `Hotel ID: ${hotelId.slice(-6)}`,
        city: hotelDoc?.city || "N/A",
        bookingCount: count
      });
    } catch {
      topHotels.push({
        _id: hotelId,
        name: "Hotel",
        city: "N/A",
        bookingCount: count
      });
    }
  }

  // 4. Hotel Distributions
  const hotelsByCityRaw = await Hotel.aggregate([
    { $group: { _id: "$city", count: { $sum: 1 } } }
  ]).catch(() => []);

  const hotelsByCity = hotelsByCityRaw.map(item => ({
    _id: item._id || "Unknown City",
    count: item.count
  }));

  const hotelsByStatusRaw = await Hotel.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]).catch(() => []);

  const hotelsByStatus = hotelsByStatusRaw.map(item => ({
    _id: item._id || "Active",
    count: item.count
  }));

  // 5. Recent Records
  const recentHotels = await Hotel.find().sort({ createdAt: -1 }).limit(5).lean().catch(() => []);
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).lean().catch(() => []);

  res.status(200).json({
    success: true,
    stats: {
      totalHotels,
      activeHotels,
      featuredHotels,
      luxuryHotels,
      totalUsers,
      totalAdmins,
      totalBookings,
      confirmedBookings,
      totalRevenue,
    },
    bookingStatus,
    topHotels,
    hotelsByCity,
    hotelsByStatus,
    recentHotels,
    recentUsers,
    revenueData,
  });
});


export const getDashboardStats = getAdminDashboard;