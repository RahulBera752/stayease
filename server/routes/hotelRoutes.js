import express from "express";

import {
  createHotel,
  getMyHotels,
  getHotels,
  getHotelBySlug,
  getHotelById,
  getFeaturedHotels,
  getPopularHotels,
  getLuxuryHotels,
  searchHotels,
  updateHotel,
  deleteHotel,
} from "../controllers/hotelController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Owner / Admin Protected Specific Routes
|--------------------------------------------------------------------------
*/
// Get Logged-In Owner's Hotels
router.get(
  "/my-hotels",
  protect,
  authorize("admin", "hotelowner", "hotelOwner", "owner"),
  getMyHotels
);

/*
|--------------------------------------------------------------------------
| Public Filtering & Search Routes
|--------------------------------------------------------------------------
*/
router.get("/", getHotels);
router.get("/search", searchHotels);
router.get("/featured", getFeaturedHotels);
router.get("/popular", getPopularHotels);
router.get("/luxury", getLuxuryHotels);

/*
|--------------------------------------------------------------------------
| Public Dynamic Routes
|--------------------------------------------------------------------------
*/
router.get("/slug/:slug", getHotelBySlug);

/*
|--------------------------------------------------------------------------
| Protected Modification Routes (Admins & Hotel Owners)
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  protect,
  authorize("admin", "hotelowner", "hotelOwner", "owner"),
  upload.single("thumbnail"),
  createHotel
);

router.put(
  "/:id",
  protect,
  authorize("admin", "hotelowner", "hotelOwner", "owner"),
  upload.single("thumbnail"),
  updateHotel
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "hotelowner", "hotelOwner", "owner"),
  deleteHotel
);

/*
|--------------------------------------------------------------------------
| Single Hotel Lookup (ID or Slug)
|--------------------------------------------------------------------------
| FIXED: Handles GET /api/hotels/:id directly without needing /id/ prefix
*/
router.get("/:id", getHotelById);

export default router;