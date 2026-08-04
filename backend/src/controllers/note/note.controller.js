import Note from "../../models/note.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { uploadOnCloudinary } from "../../utils/uploadOnCloundinary.js";
// ✅ Get all notes (current)
// Get single note
// Download note
// Increment views/downloads
// Upload note
// Update note
// Delete note
// Bookmarks
// Comments
// Premium/free access control
// Admin dashboard
//create notes
export const createNote = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    category,
    tags,
    accessLevel,
    author,
    isPublished,
  } = req.body;
  const requiredFields = {
    title,
    description,
    category,
    tags,
    accessLevel,
    author,
    isPublished,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && !value.trim()) ||
      (Array.isArray(value) && value.length === 0)
    ) {
      throw new apiError(400, `Field ${field} is required`);
    }
  }
  const localPathofPdf = req.file?.path;
  if (!localPathofPdf) {
    throw new apiError(400, "PDF file is required");
  }
  const response = await uploadOnCloudinary(
    localPathofPdf,
    "raw",
    "jurispoint/pdf",
  );
  const parsedTags = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const note = await Note.create({
    title,
    description,
    category,
    tags: parsedTags,
    accessLevel,
    author,
    isPublished: isPublished === "true",
    uploadedBy: req.user?._id,
    file: {
      url: response.secure_url,
      publicId: response.public_id,
      originalName: req.file?.originalname,
      format: req.file?.fieldname,
      size: response.bytes,
    },
  });
  return res
    .status(201)
    .json(new apiResponse(201, note, "Note created successfully"));
});
//Get all Notes
export const getAllNotes = asyncHandler(async (req, res, next) => {
  const { category, accessLevel, search } = req.query;
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (accessLevel) {
    filter.accessLevel = accessLevel;
  }
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }
  const allowedSortFields = ["createdAt", "title", "views", "downloads"];

  const sortBy = allowedSortFields.includes(req.query.sortBy)
    ? req.query.sortBy
    : "createdAt";

  const order = req.query.order === "asc" ? 1 : -1;

  const sortOptions = {
    [sortBy]: order,
  };

  const notes = await Note.find(filter).skip(skip).limit(limit).sort(sortOptions).lean();
  const totalNotes = await Note.countDocuments(filter);
  const totalPages = Math.ceil(totalNotes / limit);
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { notes, totalNotes, totalPages,skip,limit,page },
        "Notes fetched successfully",
      ),
    );
});
