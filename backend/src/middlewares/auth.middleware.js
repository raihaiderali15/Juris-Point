import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { apiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";


const verifyJwt = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new apiError(401, "ACCESS_TOKEN_MISSING");
  }

  let decoded;

  try {
    decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new apiError(401, "ACCESS_TOKEN_EXPIRED");
    }

    if (error.name === "JsonWebTokenError") {
      throw new apiError(401, "INVALID_ACCESS_TOKEN");
    }

    throw error;
  }

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new apiError(404, "User no longer exists");
  }

  req.user = user;

  next();
});

export { verifyJwt };
