// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Static & Collection Routes
|--------------------------------------------------------------------------
*/

// Create Booking
router.post("/", protect, createBooking);

// Get All Bookings / Owner Bookings
router.get(
  "/",
  protect,
  authorize("admin", "hotelowner", "hotelOwner", "owner"),
  getAllBookings
);

// Match frontend endpoint: /api/bookings/owner-bookings
router.get(
  "/owner-bookings",
  protect,
  authorize("admin", "hotelowner", "hotelOwner", "owner"),
  getAllBookings
);

// Match alternative frontend endpoint: /api/bookings/owner
router.get(
  "/owner",
  protect,
  authorize("admin", "hotelowner", "hotelOwner", "owner"),
  getAllBookings
);

// Get Logged-in Guest's own bookings
router.get("/my-bookings", protect, getMyBookings);

/*
|--------------------------------------------------------------------------
| Action Routes (Must come BEFORE generic /:id)
|--------------------------------------------------------------------------
*/

router.put(
  "/:id/status",
  protect,
  authorize("admin", "hotelowner", "hotelOwner", "owner"),
  updateBookingStatus
);

router.put("/:id/cancel", protect, cancelBooking);

/*
|--------------------------------------------------------------------------
| Generic ID Routes (Must come LAST)
|--------------------------------------------------------------------------
*/

router.get("/:id", protect, getBookingById);

router.delete(
  "/:id",
  protect,
  authorize("admin", "hotelowner", "hotelOwner", "owner"),
  deleteBooking
);

export default router;