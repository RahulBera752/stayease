import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    // Missing guest fields
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    aadhar: { type: String, required: true },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    guests: { type: Number, required: true, default: 1 },
    rooms: { type: Number, default: 1 },
    nights: { type: Number, required: true },

    pricePerNight: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    couponCode: { type: String, default: "" },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Razorpay", "Stripe"],
      default: "Cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "checked-in", "checked-out", "cancelled"],
      default: "pending",
    },
    specialRequest: { type: String, default: "" },
    bookingId: { type: String, unique: true },
  },
  { timestamps: true }
);

bookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    this.bookingId =
      "BK" + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;