import express from "express";
import {
  getAllCoupons,
  createCoupon,
  validateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

// GET all coupons & POST create coupon
router.route("/").get(getAllCoupons).post(createCoupon);

// POST validate coupon
router.post("/validate", validateCoupon);

// DELETE coupon by ID
router.delete("/:id", deleteCoupon);

export default router;