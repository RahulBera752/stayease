import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import validator from 'validator';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import otpEmailTemplate from '../emails/otpEmailTemplate.js';
import resetPasswordEmailTemplate from '../emails/resetPasswordEmailTemplate.js';
import { generateTokenAndSetCookie, clearTokenCookie } from '../utils/generateToken.js';

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

/**
 * @desc    Register a new user and send an OTP for email verification
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    otp,
    otpExpires,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your StayEase account',
      html: otpEmailTemplate({ name: user.name, otp }),
    });
  } catch (err) {
    console.error('Failed to send OTP email:', err.message);
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email for the verification code.',
    userId: user._id,
  });
});

/**
 * @desc    Verify OTP to activate account
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId).select('+otp +otpExpires');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('Account is already verified');
  }

  if (!user.otp || user.otp !== otp) {
    res.status(400);
    throw new Error('Invalid verification code');
  }

  if (user.otpExpires < new Date()) {
    res.status(400);
    throw new Error('Verification code has expired. Please request a new one.');
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  generateTokenAndSetCookie(res, user._id);

  res.status(200).json({
    success: true,
    message: 'Account verified successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
    },
  });
});

/**
 * @desc    Resend a fresh OTP code
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
export const resendOtp = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('Account is already verified');
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: 'Your new StayEase verification code',
      html: otpEmailTemplate({ name: user.name, otp }),
    });
  } catch (err) {
    console.error('Failed to resend OTP email:', err.message);
    res.status(500);
    throw new Error('Failed to send verification email. Please try again.');
  }

  res.status(200).json({ success: true, message: 'A new verification code has been sent to your email' });
});

/**
 * @desc    Login user with email + password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error('Please verify your email before logging in');
  }

  generateTokenAndSetCookie(res, user._id);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
    },
  });
});

/**
 * @desc    Logout user by clearing the auth cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

/**
 * @desc    Get currently authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

/**
 * @desc    Send password reset link to user's email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) {
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your StayEase password',
      html: resetPasswordEmailTemplate({ name: user.name, resetUrl }),
    });
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    console.error('Failed to send reset email:', err.message);
    res.status(500);
    throw new Error('Email could not be sent. Please try again later.');
  }
});

/**
 * @desc    Reset password using token from email link
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    res.status(400);
    throw new Error('Password reset link is invalid or has expired');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  generateTokenAndSetCookie(res, user._id);

  res.status(200).json({ success: true, message: 'Password has been reset successfully' });
});

/**
 * @desc    Change password while logged in
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error('Both current and new passwords are required (min 6 characters)');
  }

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password changed successfully' });
});
