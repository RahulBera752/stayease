import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";
import Booking from "../models/Booking.js";

// @desc    Create a new review (Only for completed stays)
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { hotelId, bookingId, rating, comment } = req.body;

  if (!hotelId || !bookingId || !rating || !comment) {
    res.status(400);
    throw new Error("Please fill in all fields.");
  }

  // 1. Verify booking exists for this user and hotel
  const booking = await Booking.findOne({
    _id: bookingId,
    user: req.user._id,
    hotel: hotelId,
  });

  if (!booking) {
    res.status(404);
    throw new Error("No valid booking found for this hotel.");
  }

  // 2. Check if booking is confirmed
  if (booking.status !== "Confirmed" && booking.status !== "confirmed") {
    res.status(400);
    throw new Error("You can only review confirmed bookings.");
  }

  // 3. Verify trip is completed (checkOut date is in the past)
  const checkOutDate = new Date(booking.checkOut);
  const currentDate = new Date();

  if (checkOutDate > currentDate) {
    res.status(400);
    throw new Error("You can leave a review only after your checkout date.");
  }

  // 4. Prevent duplicate reviews for the same booking
  const existingReview = await Review.findOne({ booking: bookingId });
  if (existingReview) {
    res.status(400);
    throw new Error("You have already reviewed this stay.");
  }

  // 5. Create Review
  const review = await Review.create({
    user: req.user._id,
    hotel: hotelId,
    booking: bookingId,
    rating: Number(rating),
    comment,
  });

  res.status(201).json({
    success: true,
    message: "Review submitted successfully!",
    data: review,
  });
});

// @desc    Get all reviews (Admin Only)
// @route   GET /api/reviews/admin
// @access  Private/Admin
export const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate("user", "name email")
    .populate("hotel", "name nameOfHotel title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Delete review (Admin Only)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review removed successfully",
  });
});