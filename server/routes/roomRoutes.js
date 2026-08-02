import express from "express";
import {
  createReview,
  getAllReviewsAdmin,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Route: Post Review
router.post("/", protect, createReview);

// Admin Routes
router.get("/admin", protect, admin, getAllReviewsAdmin);
router.delete("/:id", protect, admin, deleteReview);

export default router;