import User from "../../models/user.model.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import nodeMailer from "nodemailer";
import sendEmail from "../../utils/emailSender.js";
import crypto from "crypto";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import validator from "validator";
const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }
  const refreshToken = await user.generateRefreshToken();
  const accessToken = await user.generateAccessToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName, confirmPassword } = req.body;
  //checking if username email password is provided
  const fields = { username, email, password, fullName, confirmPassword };
  for (const [key, value] of Object.entries(fields)) {
    if (!value?.trim()) {
      throw new apiError(400, `${key} is required`);
    }
  }
  if (password !== confirmPassword) {
    throw new apiError(400, "Password and confirm password do not match");
  }
  //checking if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new apiError(409, "User with this email or username already exists");
  }
  //creating user
  const user = await User.create({
    username,
    email,
    password,
    fullName,
  });
  const ModifiedUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  return res
    .status(201)
    .json(new apiResponse(201, ModifiedUser, "User registered successfully"));
});

//login user

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!password?.trim() || (!email?.trim() && !username?.trim())) {
    throw new apiError(400, "Email or username and password are required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] }).select(
    "+password",
  );
  if (!user) {
throw new apiError(401, "Invalid email/username or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
 throw new apiError(401, "Invalid email/username or password");
  }
  const { accessToken, refreshToken } = await generateTokens(user._id);
  const ModifiedUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new apiResponse(
        200,
        { user: ModifiedUser, accessToken },
        "User logged in successfully",
      ),
    );
});
//logout User
const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: 1 },
  });
  if (!user) {
    throw new apiError(404, "User not found");
  }
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new apiResponse(200, {}, "User logged out successfully"));
});
//generate new access token using refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!refreshToken) {
    throw new apiError(401, "Unauthorized user");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new apiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded._id).select("+refreshToken");
  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (!user.refreshToken) {
    throw new apiError(401, "Refresh token mismatch");
  }

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(user.refreshToken),
    Buffer.from(refreshToken),
  );
  if (!isMatch) {
    throw new apiError(401, "Refresh token mismatch");
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  const accessTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  };

  const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .cookie("accessToken", newAccessToken, accessTokenCookieOptions)
    .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
    .status(200)
    .json(
      new apiResponse(
        200,
        { accessToken: newAccessToken },
        "New access token generated successfully",
      ),
    );
});
//: add forgot password and reset password functionality
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new apiError(400, "Email is required for Reset Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          {},
          "If user with this email exists we will send you an email to reset your password",
        ),
      );
  }
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.username},</p>
        <p>You requested to reset your password. Please click the link below to set a new password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
      `,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    throw new apiError(500, "Failed to send reset email. Please try again.");
  }
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        {},
        "If user with this email exists we will send you an email to reset your password",
      ),
    );
});
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const { password, confirmPassword } = req.body;
  if (!token) {
    throw new apiError(400, "Reset token is required");
  }
  if (!password || !confirmPassword) {
    throw new apiError(400, "Password and confirm password are required");
  }
  if (password !== confirmPassword) {
    throw new apiError(400, "Password and confirm password do not match");
  }
  const hashedToken = createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new apiError(400, "Invalid or expired reset token");
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  try {
    await user.save();
  } catch (err) {
    throw new apiError(500, "Something went wrong while resetting password");
  }
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password reset successfully"));
});
// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new apiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new apiResponse(200, { user }, "User profile retrieved successfully"),
    );
});
// update Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { username, email, fullName } = req.body;

  const fieldsToUpdate = {};
  if (username?.trim()) fieldsToUpdate.username = username.trim();
  if (email?.trim()) {
    if (!validator.isEmail(email))
      throw new apiError(400, "Invalid email format");
    fieldsToUpdate.email = email.trim();
  }
  if (fullName?.trim()) fieldsToUpdate.fullName = fullName.trim();

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new apiError(400, "No valid fields provided for update");
  }

  let updatedUser;
  try {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true },
    ).select("-password -refreshToken");
  } catch (err) {
    if (err.code === 11000) {
      throw new apiError(409, "Username or email already in use");
    }
    throw err;
  }

  if (!updatedUser) {
    throw new apiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { user: updatedUser },
        "User profile updated successfully",
      ),
    );
});
//delete user profile
const deleteUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new apiResponse(200, {}, "User profile deleted successfully"));
});
//change password
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const fields = { currentPassword, newPassword, confirmNewPassword };
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string" || !value?.trim()) {
      throw new apiError(400, `${key} is required`);
    }
  }
  if (currentPassword === newPassword) {
    throw new apiError(
      400,
      "New password must be different from current password",
    );
  }
  if (newPassword !== confirmNewPassword) {
    throw new apiError(
      400,
      "New password and confirm new password do not match",
    );
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new apiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();
  const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  return res
    .status(200)
    .clearCookie("accessToken", cookiesOptions)
    .clearCookie("refreshToken", cookiesOptions)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});
// get all user (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
const skip = (page - 1) * limit;

const users = await User.find()
  .select("-password -refreshToken")
  .skip(skip)
  .limit(limit);
  return res
    .status(200)
    .json(new apiResponse(200, { users }, "Users retrieved successfully"));
});
//change user role (admin only) 
const changeUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (req.user.role !== "admin") {
    throw new apiError(403, "Only admins can change user roles");
  }

  if (req.user._id.toString() === userId) {
    throw new apiError(400, "You cannot change your own role");
  }

  if (typeof role !== "string" || !role.trim()) {
    throw new apiError(400, "Role is required");
  }

  const normalizedRole = role.trim();

  const allowedRoles = ["user", "admin"];
  if (!allowedRoles.includes(normalizedRole)) {
    throw new apiError(
      400,
      `Role must be one of: ${allowedRoles.join(", ")}`
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role: normalizedRole },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, { user }, "User role updated successfully")
    );
});
//delete user (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // only admin
  if (req.user.role !== "admin") {
    throw new apiError(403, "Only admins can delete users");
  }

  // prevent self delete
  if (req.user._id.toString() === userId) {
    throw new apiError(400, "You cannot delete your own account");
  }

  // find user first
  const user = await User.findById(userId);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  // optional: prevent deleting admins
  if (user.role === "admin") {
    throw new apiError(403, "Admins cannot be deleted");
  }

  await user.deleteOne();

  return res.status(200).json(
    new apiResponse(200, null, "User deleted successfully")
  );
});

// ban user (admin only)
const banUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (req.user.role !== "admin") {
    throw new apiError(403, "Only admins can ban users");
  }
  if (req.user._id.toString() === userId) {
    throw new apiError(400, "You cannot ban your own account");
  }
  const user= await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }
  if(user.role==="admin"){
    throw new apiError(400, "You cannot ban another admin");
  }
  if (user.isBanned===true) {
    throw new apiError(400, "User is already banned");
  }
  user.isBanned=true;
  await user.save({ validateBeforeSave: false });
  const bannedUser = await User.findById(userId).select("-password -refreshToken");
  return res
    .status(200)
    .json(new apiResponse(200, { bannedUser }, "User banned successfully"));
});
// unban User (admin Only)
const unbanUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (req.user.role !== "admin") {
    throw new apiError(403, "Only admins can unban users");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }
  if (user.isBanned !== true) {
    throw new apiError(400, "User is not banned");
  }
  user.isBanned = false;
  await user.save({ validateBeforeSave: false });
  const unbannedUser = await User.findById(userId).select("-password -refreshToken");
  return res
    .status(200)
    .json(new apiResponse(200, { unbannedUser }, "User unbanned successfully"));
});
// verify User Email
const verifyEmail = asyncHandler(async (req, res) => {
  const userId=req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");     
  }
  if (user.isVerified===true) {
    throw new apiError(400, "Email is already verified");
  } 
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;  
  await sendEmail({
    to: user.email,
    subject: "Email Verification",
    html: `
      <p>Hello ${user.username},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" target="_blank">Verify Email</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });

  return res.status(200).json(
    new apiResponse(200, null, "Verification email sent successfully")
  );
});
//verify email token and set isVerified to true
const verifyEmailToken = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw new apiError(400, "Verification token is required");
  }
  const hashedToken = createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new apiError(400, "Invalid or expired verification token");
  }
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new apiResponse(200, null, "Email verified successfully")
  );
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  changeUserRole,
  deleteUser,
  banUser,
  unbanUser,
  deleteUserProfile,
  verifyEmail,
  verifyEmailToken
};