import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please add a coupon code"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: [true, "Please add a discount percentage"],
      min: [1, "Discount must be at least 1%"],
      max: [100, "Discount cannot exceed 100%"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Please add an expiration date"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;