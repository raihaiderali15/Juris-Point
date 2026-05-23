import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { apiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async (req, res, next) => {
  const accessToken =
    req?.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!accessToken) {
    throw new apiError(4001, "Unauthorized User from cookies or headers");
  }
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded) {
    throw new apiError(4001, "Invalid Access Token");
  }
  const user = await User.findById(decoded._id).select(
    "-password -refreshToken",
  );
  if (!user) {
    throw new apiError(404, "User no longer exists");
  }
  req.user = user;
  next();
});
export { verifyJwt };
