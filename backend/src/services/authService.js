const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');

/**
 * @desc Register user
 */
exports.register = async (userData) => {
  const { firstName, lastName, email, password, role } = userData;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ErrorResponse('User already exists', 400);
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role
  });

  return user;
};

/**
 * @desc Login user
 */
exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new ErrorResponse('Account locked, try again later', 403);
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    // Increment login attempts
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 mins lock
    }
    await user.save();
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Reset login attempts on success
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  return user;
};

/**
 * @desc Reset Password
 */
exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorResponse('There is no user with that email', 404);
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // In a real app, send email with resetToken
  return resetToken;
};

/**
 * @desc Set new password
 */
exports.resetPassword = async (resetToken, newPassword) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ErrorResponse('Invalid token', 400);
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return user;
};
