import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      default: "India",
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    // GeoJSON location with default: undefined to prevent empty coordinates array
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: undefined, // CRITICAL: Prevents Mongoose from auto-creating coordinates: []
      },
      latitude: Number,
      longitude: Number,
    },

    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    thumbnail: {
      type: String,
      required: [true, "Hotel thumbnail image is required"],
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    amenities: [
      {
        type: String,
      },
    ],

    roomTypes: [
      {
        type: String,
      },
    ],

    availableRooms: {
      type: Number,
      default: 0,
    },

    maxGuests: {
      type: Number,
      default: 2,
    },

    starRating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    popular: {
      type: Boolean,
      default: false,
    },

    luxury: {
      type: Boolean,
      default: true,
    },

    verified: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Hotel owner ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
hotelSchema.index({
  name: "text",
  city: "text",
  country: "text",
});

hotelSchema.index({ owner: 1 });
hotelSchema.index({ location: "2dsphere" }, { sparse: true });

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;