import express from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
  updateUserProfile,
  updateUserRole,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Password Recovery Routes (Must be placed before /:id routes)
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// @route   GET /api/users
// @desc    Get all users (Admin only)
router.get("/", protect, admin, getUsers);

// @route   PATCH /api/users/:id/role
// @desc    Update user role specifically (Admin only)
router.patch("/:id/role", protect, admin, updateUserRole);

// @route   GET, PUT, DELETE /api/users/:id
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, updateUserProfile) // Handles general profile updates (name, email, role, password)
  .delete(protect, admin, deleteUser);

export default router;