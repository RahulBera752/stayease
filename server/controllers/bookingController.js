import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

/**
 * @desc    Create Booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = asyncHandler(async (req, res) => {
  const {
    hotelId,
    checkIn,
    checkOut,
    guests,
    rooms,
    fullName,
    mobile,
    email,
    address,
    aadhar,
    couponCode,
    discount,
    paymentMethod,
    specialRequest,
    paymentDetails,
  } = req.body;

  if (!hotelId || !checkIn || !checkOut || !fullName || !mobile || !address || !aadhar) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required booking and guest details.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Hotel ID format.",
    });
  }

  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: "Hotel not found.",
    });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return res.status(400).json({
      success: false,
      message: "Check-out must be after check-in.",
    });
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const nights = Math.max(
    1,
    Math.ceil((checkOutDate - checkInDate) / millisecondsPerDay)
  );

  const pricePerNight =
    hotel.price ||
    hotel.pricePerNight ||
    hotel.startingPrice ||
    0;

  const subtotal = pricePerNight * nights * (rooms || 1);

  const discountPercent = Number(discount) || 0;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const tax = Math.round(subtotal * 0.18);
  const totalPrice = subtotal - discountAmount + tax;

  // Check if payment is online/prepaid
  const isOnlinePayment =
    paymentMethod === "Razorpay" ||
    paymentMethod === "Online" ||
    paymentMethod === "Online (Razorpay)" ||
    paymentMethod === "Card";

  const booking = await Booking.create({
    user: req.user._id,
    hotel: hotel._id,

    fullName,
    mobile,
    email,
    address,
    aadhar,

    checkIn,
    checkOut,
    guests: guests || 1,
    rooms: rooms || 1,
    nights,

    pricePerNight,
    subtotal,
    couponCode: couponCode || "",
    discount: discountPercent,
    tax,
    totalPrice,

    paymentMethod: paymentMethod || "Cash",
    paymentDetails: paymentDetails || {},
    specialRequest: specialRequest || "",

    bookingStatus: "pending",
    paymentStatus: isOnlinePayment ? "paid" : "pending",
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate("hotel")
    .populate("user", "name email");

  res.status(201).json({
    success: true,
    message: "Booking created successfully.",
    booking: populatedBooking,
    bookingId: booking.bookingId,
  });
});

/**
 * @desc    Get Logged In Guest's Bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
  })
    .populate("hotel")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

/**
 * @desc    Get All Bookings (Admin sees all, Hotel Owner sees theirs)
 * @route   GET /api/bookings
 * @access  Private (Admin / Hotel Owner)
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  let filter = {};
  const userRole = req.user?.role?.toLowerCase();

  if (userRole === "hotelowner" || userRole === "owner") {
    const ownerHotels = await Hotel.find({ owner: req.user._id }).select("_id");
    const hotelIds = ownerHotels.map((h) => h._id);
    filter = { hotel: { $in: hotelIds } };
  }

  const bookings = await Booking.find(filter)
    .populate("user", "name email phone")
    .populate("hotel", "name city owner")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

/**
 * @desc    Get Booking By ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Booking ID format.",
    });
  }

  const booking = await Booking.findById(id)
    .populate("user", "name email phone")
    .populate("hotel");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found.",
    });
  }

  const userRole = req.user?.role?.toLowerCase();
  const isGuest = booking.user._id.toString() === req.user._id.toString();
  const isAdmin = userRole === "admin";
  const isHotelOwner =
    (userRole === "hotelowner" || userRole === "owner") &&
    booking.hotel?.owner?.toString() === req.user._id.toString();

  if (!isGuest && !isAdmin && !isHotelOwner) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view this booking.",
    });
  }

  res.status(200).json({
    success: true,
    booking,
  });
});

/**
 * @desc    Update Booking Status (Confirm / Cancel / Check-in / Check-out)
 * @route   PUT /api/bookings/:id/status
 * @access  Private (Admin / Hotel Owner)
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { bookingStatus, status, paymentStatus } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Booking ID format.",
    });
  }

  const booking = await Booking.findById(id).populate("hotel");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found.",
    });
  }

  const userRole = req.user?.role?.toLowerCase();

  if (userRole === "hotelowner" || userRole === "owner") {
    const hotelOwnerId = booking.hotel?.owner?.toString();
    if (hotelOwnerId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update bookings for your own hotels.",
      });
    }
  }

  const targetStatus = (bookingStatus || status)?.toLowerCase();

  if (targetStatus) {
    const validStatuses = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];
    if (!validStatuses.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }
    booking.bookingStatus = targetStatus;
  }

  if (paymentStatus) {
    booking.paymentStatus = paymentStatus.toLowerCase();
  }

  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate("user", "name email")
    .populate("hotel", "name city");

  res.status(200).json({
    success: true,
    message: "Booking status updated successfully.",
    booking: updatedBooking,
  });
});

/**
 * @desc    Cancel Booking (Guest canceling their own booking)
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Booking ID format.",
    });
  }

  const booking = await Booking.findById(id).populate("hotel");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found.",
    });
  }

  const userRole = req.user?.role?.toLowerCase();
  const isGuest = booking.user.toString() === req.user._id.toString();
  const isAdmin = userRole === "admin";
  const isHotelOwner =
    (userRole === "hotelowner" || userRole === "owner") &&
    booking.hotel?.owner?.toString() === req.user._id.toString();

  if (!isGuest && !isAdmin && !isHotelOwner) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to cancel this booking.",
    });
  }

  if (booking.bookingStatus === "cancelled") {
    return res.status(400).json({
      success: false,
      message: "Booking is already cancelled.",
    });
  }

  booking.bookingStatus = "cancelled";

  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully.",
    booking,
  });
});

/**
 * @desc    Delete Booking
 * @route   DELETE /api/bookings/:id
 * @access  Private (Admin / Hotel Owner)
 */
export const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Booking ID format.",
    });
  }

  const booking = await Booking.findById(id).populate("hotel");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found.",
    });
  }

  const userRole = req.user?.role?.toLowerCase();

  if (
    userRole !== "admin" &&
    ((userRole !== "hotelowner" && userRole !== "owner") ||
      booking.hotel?.owner?.toString() !== req.user._id.toString())
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this booking.",
    });
  }

  await booking.deleteOne();

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully.",
  });
});