/**
 * Catch-all for routes that don't match any defined endpoint.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized error handler. Formats Mongoose validation/cast errors
 * and JWT errors into consistent JSON responses.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Print full error stack in development console for debugging
  if (process.env.NODE_ENV !== "production") {
    console.error("🔥 Central Error Handler Caught:", err);
  }

  // Mongoose bad ObjectId format
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400; // Changed from 404 to 400 to differentiate from missing routes
    message = `Invalid ID format for field: ${err.path}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for ${field} field`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Not authorized, invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Not authorized, token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};