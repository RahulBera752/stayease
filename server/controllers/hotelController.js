import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";

/*
|--------------------------------------------------------------------------
| Helper: Generate URL-friendly slug
|--------------------------------------------------------------------------
*/
const generateSlug = (text) => {
  return text
    ?.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/*
|--------------------------------------------------------------------------
| Helper: Safely Extract & Format Uploaded File Path / Full URL
|--------------------------------------------------------------------------
*/
const getUploadedFilePath = (req, file, bodyThumbnail) => {
  let rawPath = "";

  if (file) {
    // 1. Cloudinary / External Hosted URL
    if (typeof file.path === "string" && (file.path.startsWith("http://") || file.path.startsWith("https://"))) {
      return file.path;
    }
    if (typeof file.secure_url === "string") return file.secure_url;
    if (typeof file.url === "string") return file.url;

    // 2. Local Multer Disk Storage
    if (file.filename) {
      rawPath = `uploads/${file.filename}`;
    } else if (typeof file.path === "string") {
      rawPath = file.path;
    }
  } else if (bodyThumbnail) {
    // Handle bodyThumbnail whether passed as string, object, or array
    if (typeof bodyThumbnail === "string") {
      rawPath = bodyThumbnail;
    } else if (typeof bodyThumbnail === "object" && bodyThumbnail !== null) {
      rawPath = bodyThumbnail.url || bodyThumbnail.secure_url || bodyThumbnail.path || bodyThumbnail.filename || "";
    }
  }

  // 🚨 CRITICAL FIX: Explicitly cast rawPath to string to avoid .replace() errors
  rawPath = String(rawPath || "").trim();

  if (!rawPath) return "";

  // Normalize Windows backslashes (\) to standard forward slashes (/)
  const cleanPath = rawPath.replace(/\\/g, "/").replace(/^\/+/, "");

  // Return as-is if already a full URL
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  // Prepend backend host URL (e.g., http://localhost:5000/uploads/filename.jpg)
  const host = req ? `${req.protocol}://${req.get("host")}` : "";
  return host ? `${host}/${cleanPath}` : `/${cleanPath}`;
};

/*
|--------------------------------------------------------------------------
| Helper: Parse Amenities from FormData
|--------------------------------------------------------------------------
*/
const parseAmenities = (amenitiesData) => {
  if (!amenitiesData) return [];
  if (Array.isArray(amenitiesData)) return amenitiesData;
  if (typeof amenitiesData === "string") {
    try {
      return JSON.parse(amenitiesData);
    } catch (e) {
      return amenitiesData.split(",").map((a) => a.trim()).filter(Boolean);
    }
  }
  return [];
};

/*
|--------------------------------------------------------------------------
| Create Hotel (Admin or Hotel Owner)
|--------------------------------------------------------------------------
*/
export const createHotel = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    address,
    city,
    country,
    latitude,
    longitude,
    pricePerNight,
    originalPrice,
    tax,
    availableRooms,
    maxGuests,
    starRating,
    status,
    featured,
    isFeatured,
    popular,
    isPopular,
    luxury,
    isLuxury,
    amenities,
  } = req.body;

  // 1. Get formatted image URL safely
  const thumbnail = getUploadedFilePath(req, req.file, req.body.thumbnail);

  if (!thumbnail) {
    res.status(400);
    throw new Error("Please upload or provide a thumbnail image.");
  }

  // 2. Auto-generate slug if not explicitly passed
  const hotelSlug = slug ? generateSlug(slug) : generateSlug(name);

  // 3. Build clean hotel data payload with type safety
  const hotelData = {
    name,
    slug: hotelSlug,
    description,
    address,
    city,
    country: country || "India",
    thumbnail,
    amenities: parseAmenities(amenities),
    pricePerNight: Number(pricePerNight),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    tax: tax !== undefined ? Number(tax) : 18,
    availableRooms: availableRooms !== undefined ? Number(availableRooms) : 10,
    maxGuests: maxGuests !== undefined ? Number(maxGuests) : 2,
    starRating: starRating !== undefined ? Number(starRating) : 4,
    status: status || "active",
    isFeatured:
      isFeatured === "true" ||
      isFeatured === true ||
      featured === "true" ||
      featured === true,
    isPopular:
      isPopular === "true" ||
      isPopular === true ||
      popular === "true" ||
      popular === true,
    isLuxury:
      isLuxury === "true" ||
      isLuxury === true ||
      luxury === "true" ||
      luxury === true,
    owner: req.user._id,
  };

  // Add GeoJSON point location if coordinates exist
  if (latitude !== undefined && longitude !== undefined) {
    hotelData.location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
  }

  const hotel = await Hotel.create(hotelData);

  res.status(201).json({
    success: true,
    message: "Hotel created successfully",
    hotel,
  });
});

/*
|--------------------------------------------------------------------------
| Get Logged-In Owner's Hotels ONLY (Hotel Owner Panel)
|--------------------------------------------------------------------------
*/
export const getMyHotels = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { owner: req.user._id };

  const hotels = await Hotel.find(query)
    .populate("owner", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: hotels.length,
    hotels,
  });
});

/*
|--------------------------------------------------------------------------
| Get All Public Active Hotels
|--------------------------------------------------------------------------
*/
export const getHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({ status: "active" })
    .populate("owner", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: hotels.length,
    hotels,
  });
});

/*
|--------------------------------------------------------------------------
| Get Hotel By ID
|--------------------------------------------------------------------------
*/
export const getHotelById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let hotel;

  if (mongoose.Types.ObjectId.isValid(id)) {
    hotel = await Hotel.findById(id).populate("owner", "name email").maxTimeMS(4000);
  }

  if (!hotel) {
    hotel = await Hotel.findOne({
      $or: [
        { slug: id },
        { name: new RegExp(`^${id.replace(/-/g, " ")}$`, "i") },
      ],
    }).populate("owner", "name email").maxTimeMS(4000);
  }

  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: "Hotel not found",
    });
  }

  res.status(200).json({
    success: true,
    hotel,
  });
});

/*
|--------------------------------------------------------------------------
| Get Hotel By Slug
|--------------------------------------------------------------------------
*/
export const getHotelBySlug = asyncHandler(async (req, res) => {
  const slugParam = req.params.slug;
  const normalizedSlug = slugParam.toLowerCase();
  const spacedName = slugParam.replace(/-/g, " ");

  const hotel = await Hotel.findOne({
    $or: [
      { slug: slugParam },
      { slug: normalizedSlug },
      { slug: normalizedSlug.replace(/\s+/g, "-") },
      { name: new RegExp(`^${spacedName}$`, "i") },
    ],
  }).maxTimeMS(4000);

  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: "Hotel not found",
    });
  }

  res.status(200).json({
    success: true,
    hotel,
  });
});

/*
|--------------------------------------------------------------------------
| Featured / Popular / Luxury Filters
|--------------------------------------------------------------------------
*/
export const getFeaturedHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({
    $or: [{ isFeatured: true }, { featured: true }],
    status: "active",
  }).maxTimeMS(4000);
  res.status(200).json({ success: true, hotels });
});

export const getPopularHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({
    $or: [{ isPopular: true }, { popular: true }],
    status: "active",
  }).maxTimeMS(4000);
  res.status(200).json({ success: true, hotels });
});

export const getLuxuryHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({
    $or: [{ isLuxury: true }, { luxury: true }],
    status: "active",
  }).maxTimeMS(4000);
  res.status(200).json({ success: true, hotels });
});

/*
|--------------------------------------------------------------------------
| Search Hotels
|--------------------------------------------------------------------------
*/
export const searchHotels = asyncHandler(async (req, res) => {
  const { destination, minPrice, maxPrice, guests } = req.query;
  const query = { status: "active" };

  if (destination) {
    query.$or = [
      { city: { $regex: destination, $options: "i" } },
      { country: { $regex: destination, $options: "i" } },
      { name: { $regex: destination, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
  }

  if (guests) {
    query.maxGuests = { $gte: Number(guests) };
  }

  const hotels = await Hotel.find(query).maxTimeMS(4000);

  res.status(200).json({
    success: true,
    count: hotels.length,
    hotels,
  });
});

/*
|--------------------------------------------------------------------------
| Update Hotel (Admin or Hotel Owner)
|--------------------------------------------------------------------------
*/
export const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).maxTimeMS(4000);

  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: "Hotel not found",
    });
  }

  // Strictly enforce ownership check
  if (
    req.user.role !== "admin" &&
    hotel.owner.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this hotel",
    });
  }

  const updateData = { ...req.body };

  // 1. Capture new thumbnail image from Multer or Body if updated
  if (req.file || req.body.thumbnail) {
    const updatedThumbnail = getUploadedFilePath(req, req.file, req.body.thumbnail);
    if (updatedThumbnail) {
      updateData.thumbnail = updatedThumbnail;
    }
  }

  // 2. Parse amenities if present
  if (updateData.amenities) {
    updateData.amenities = parseAmenities(updateData.amenities);
  }

  // 3. Format slug if name or slug updated
  if (updateData.slug) {
    updateData.slug = generateSlug(updateData.slug);
  } else if (updateData.name) {
    updateData.slug = generateSlug(updateData.name);
  }

  // 4. Cast numeric fields if sent as strings via FormData
  if (updateData.pricePerNight) updateData.pricePerNight = Number(updateData.pricePerNight);
  if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice);
  if (updateData.tax) updateData.tax = Number(updateData.tax);
  if (updateData.availableRooms) updateData.availableRooms = Number(updateData.availableRooms);
  if (updateData.maxGuests) updateData.maxGuests = Number(updateData.maxGuests);
  if (updateData.starRating) updateData.starRating = Number(updateData.starRating);

  // 5. Convert string booleans
  if (updateData.isFeatured !== undefined) {
    updateData.isFeatured = updateData.isFeatured === "true" || updateData.isFeatured === true;
  }
  if (updateData.isPopular !== undefined) {
    updateData.isPopular = updateData.isPopular === "true" || updateData.isPopular === true;
  }
  if (updateData.isLuxury !== undefined) {
    updateData.isLuxury = updateData.isLuxury === "true" || updateData.isLuxury === true;
  }

  // 6. GeoJSON location update
  if (updateData.latitude !== undefined && updateData.longitude !== undefined) {
    updateData.location = {
      type: "Point",
      coordinates: [parseFloat(updateData.longitude), parseFloat(updateData.latitude)],
    };
  }

  const updatedHotel = await Hotel.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).maxTimeMS(4000);

  res.status(200).json({
    success: true,
    message: "Hotel updated successfully",
    hotel: updatedHotel,
  });
});

/*
|--------------------------------------------------------------------------
| Delete Hotel (Admin or Hotel Owner)
|--------------------------------------------------------------------------
*/
export const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).maxTimeMS(4000);

  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: "Hotel not found",
    });
  }

  // Strictly enforce ownership check
  if (
    req.user.role !== "admin" &&
    hotel.owner.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this hotel",
    });
  }

  await hotel.deleteOne();

  res.status(200).json({
    success: true,
    message: "Hotel deleted successfully",
  });
});