import Coupon from "../models/couponModel.js";

/**
 * @desc    Get all coupons (Admin)
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new coupon
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountValue, expiryDate } = req.body;

    if (!code || !discountValue || !expiryDate) {
      res.status(400);
      throw new Error("Please provide code, discount value, and expiry date");
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      res.status(400);
      throw new Error("Coupon code already exists");
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount: Number(discountValue),
      expiryDate,
    });

    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Validate coupon during checkout
 * @route   POST /api/coupons/validate
 * @access  Private
 */
export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      res.status(400);
      throw new Error("Please provide a coupon code");
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      res.status(404);
      throw new Error("Invalid coupon code");
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      res.status(400);
      throw new Error("Coupon has expired");
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountPercentage: coupon.discount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      res.status(404);
      throw new Error("Coupon not found");
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};