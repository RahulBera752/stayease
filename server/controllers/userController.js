import asyncHandler from "express-async-handler";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js"; // 👈 Import your Nodemailer utility

// @desc    Get all users
// @route   GET /api/users or /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// @desc    Update user profile or role (General Update)
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update basic info if provided
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  // Handle role update when passed in body
  if (req.body.role) {
    user.role = req.body.role;
    user.isAdmin = req.body.role === "admin";
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isAdmin: updatedUser.isAdmin,
    },
  });
});

// @desc    Update specific user role (Admin specific endpoint)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role) {
    res.status(400);
    throw new Error("Role field is required");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = role;
  user.isAdmin = role === "admin";

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isAdmin: updatedUser.isAdmin,
    },
  });
});

// @desc    Forgot Password - Generate reset token & Send Email
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide an email address");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found with this email");
  }

  // Generate random reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set expiration to 10 minutes (matches resetPasswordExpires in User model)
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  // Create reset link URL
  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

  // Styled email HTML template matching your dark-mode UI
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #030712; color: #ffffff; padding: 40px 20px;">
      <div style="max-width: 500px; margin: 0 auto; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        <h2 style="color: #38bdf8; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">
          StayEase Security
        </h2>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          You have requested to reset your password. Click the secure button below to proceed. This link will expire in 10 minutes.
        </p>
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${resetUrl}" target="_blank" style="display: inline-block; background: linear-gradient(to right, #06b6d4, #2563eb); color: #ffffff; padding: 14px 32px; border-radius: 16px; font-weight: bold; text-decoration: none; font-size: 14px; box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.3);">
            Reset Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
          If you did not request this password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Instructions - StayEase",
      html,
    });

    res.status(200).json({
      success: true,
      message: `Password reset instructions sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(500);
    throw new Error("Email could not be sent. Please try again later.");
  }
});

// @desc    Reset Password
// @route   PUT /api/users/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  const { password } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  // Assign plain password; your User model pre-save hook will handle hashing
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully. You can now log in.",
  });
});