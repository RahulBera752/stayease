import express from "express";
import {
  createReview,
  getAllReviewsAdmin,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. User Route: Create Review
router.post("/", protect, createReview);

// 2. Admin Route: MUST be placed BEFORE /:id
router.get("/admin", protect, admin, getAllReviewsAdmin);

// 3. Parametric Route: Delete Review by ID
router.delete("/:id", protect, admin, deleteReview);

export default router;