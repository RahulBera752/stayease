import express from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all users (Admin only)
router.get("/", protect, admin, getUsers);

// Get single user profile or delete user (Admin / Protected)
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, updateUserProfile)
  .delete(protect, admin, deleteUser);

export default router;