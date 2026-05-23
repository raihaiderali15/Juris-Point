import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
const connectdb = asyncHandler(async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("connected to database");
});
export default connectdb;