import express from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import { getUsers, updateUserRole } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
router.get("/dashboard", protect, admin, getAdminDashboard);

/*
|--------------------------------------------------------------------------
| User Management
|--------------------------------------------------------------------------
*/
// @route   GET /api/admin/users
router.get("/users", protect, admin, getUsers);

// @route   PATCH & PUT /api/admin/users/:id/role
router.patch("/users/:id/role", protect, admin, updateUserRole);
router.put("/users/:id/role", protect, admin, updateUserRole);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StayEase Admin API Working 🚀",
  });
});

export default router;