import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * Protects routes by verifying the JWT sent via httpOnly cookie
 * (falls back to Authorization header for API clients/testing).
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token || req.cookies?.jwt;

  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Look for decoded.userId OR decoded.id
    const userId = decoded.userId || decoded.id;

    req.user = await User.findById(userId).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user no longer exists');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

/**
 * Restricts access to specific roles (Case-Insensitive).
 * Usage: authorize('admin'), authorize('hotelOwner', 'admin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase();
    const allowedRoles = roles.map((role) => role.toLowerCase());

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403);
      throw new Error(`Role '${req.user?.role}' is not authorized to access this resource`);
    }

    next();
  };
};

/**
 * Middleware alias for Admin-only routes
 */
export const admin = (req, res, next) => {
  const userRole = req.user?.role?.toLowerCase();

  if (req.user && userRole === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

/**
 * Middleware alias for Hotel Owners and Admins (Case-Insensitive & Alias-friendly)
 */
export const isOwnerOrAdmin = (req, res, next) => {
  const userRole = req.user?.role?.toLowerCase();
  const allowedOwnerRoles = ['hotelowner', 'owner', 'admin'];

  if (req.user && allowedOwnerRoles.includes(userRole)) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized. Requires Hotel Owner or Admin permissions');
  }
};