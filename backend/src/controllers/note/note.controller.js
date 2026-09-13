import Note from "../../models/note.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { uploadOnCloudinary } from "../../utils/uploadOnCloundinary.js";
import removeFromCloudinary from "../../utils/removeFromCloudinary.js";
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


const ALLOWED_ACCESS_LEVELS = ["public", "private", "restricted"];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeTags = (tags) => {
  const arr = Array.isArray(tags)
    ? tags
    : String(tags).split(",");
  return arr.map((t) => t.trim().toLowerCase()).filter(Boolean);
};

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

  if (!ALLOWED_ACCESS_LEVELS.includes(accessLevel)) {
    throw new apiError(400, "Invalid accessLevel");
  }

  const categoryExists = await Category.exists({ _id: category });
  if (!categoryExists) {
    throw new apiError(400, "Invalid category");
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

  let note;
  try {
    note = await Note.create({
      title: title.trim(),
      description: description.trim(),
      category,
      tags: normalizeTags(tags),
      accessLevel,
      author: author.trim(),
      isPublished: isPublished === true || isPublished === "true",
      uploadedBy: req.user?._id,
      file: {
        url: response.secure_url,
        publicId: response.public_id,
        originalName: req.file?.originalname,
        format: req.file?.mimetype,
        size: response.bytes,
      },
    });
  } catch (err) {
    // Roll back the uploaded file so it doesn't get orphaned on Cloudinary
    await removeFromCloudinary(response.public_id, "raw").catch(() => {});
    throw err;
  }

  return res
    .status(201)
    .json(new apiResponse(201, note, "Note created successfully"));
});

// Update Note
export const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findById(id);
  if (!note) {
    throw new apiError(404, "Note not found");
  }

  // Only the uploader (or an admin) can edit
  const isOwner = note.uploadedBy?.toString() === req.user?._id?.toString();
  const isAdmin = req.user?.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new apiError(403, "You are not authorized to edit this note");
  }

  const {
    title,
    description,
    category,
    tags,
    accessLevel,
    author,
    isPublished,
  } = req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      throw new apiError(400, "Title cannot be empty");
    }
    note.title = title.trim();
  }

  if (description !== undefined) {
    if (!description.trim()) {
      throw new apiError(400, "Description cannot be empty");
    }
    note.description = description.trim();
  }

  if (category !== undefined) {
    const categoryExists = await Category.exists({ _id: category });
    if (!categoryExists) {
      throw new apiError(400, "Invalid category");
    }
    note.category = category;
  }

  if (tags !== undefined) {
    note.tags = normalizeTags(tags);
  }

  if (accessLevel !== undefined) {
    if (!ALLOWED_ACCESS_LEVELS.includes(accessLevel)) {
      throw new apiError(400, "Invalid accessLevel");
    }
    note.accessLevel = accessLevel;
  }

  if (author !== undefined) {
    if (!author.trim()) {
      throw new apiError(400, "Author cannot be empty");
    }
    note.author = author.trim();
  }

  if (isPublished !== undefined) {
    note.isPublished = isPublished === true || isPublished === "true";
  }

  await note.save();

  return res
    .status(200)
    .json(new apiResponse(200, note, "Note updated successfully"));
});

// Delete Note
export const deleteNotes = asyncHandler(async (req, res, next) => {
  const noteId = req.params.id;
  const note = await Note.findById(noteId);
  if (!note) {
    throw new apiError(404, "Note not found");
  }

  const isOwner = note.uploadedBy?.toString() === req.user?._id?.toString();
  const isAdmin = req.user?.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new apiError(403, "You are not authorized to delete this note");
  }

  // Delete the DB record first — if this fails, we haven't touched the file yet
  const deletedNote = await Note.findByIdAndDelete(noteId);

  const cloudinaryResponse = await removeFromCloudinary(
    note.file.publicId,
    "raw",
  );

  if (cloudinaryResponse?.result !== "ok") {
    // Note is already gone from DB; log for manual cleanup instead of
    // throwing (the delete itself succeeded from the user's point of view)
    console.error(
      `Cloudinary cleanup failed for publicId ${note.file.publicId}:`,
      cloudinaryResponse,
    );
  }

  return res
    .status(200)
    .json(new apiResponse(200, deletedNote, "Note deleted successfully"));
});

// Get all Notes
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
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const allowedSortFields = ["createdAt", "title", "views", "downloads"];
  const sortBy = allowedSortFields.includes(req.query.sortBy)
    ? req.query.sortBy
    : "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;
  const sortOptions = { [sortBy]: order };

  const notes = await Note.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sortOptions)
    .lean();
  const totalNotes = await Note.countDocuments(filter);
  const totalPages = Math.ceil(totalNotes / limit);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { notes, totalNotes, totalPages, skip, limit, page },
        "Notes fetched successfully",
      ),
    );
});

// Get note by ID
export const getNoteById = asyncHandler(async (req, res, next) => {
  const noteId = req.params.id;
  const note = await Note.findByIdAndUpdate(
    noteId,
    { $inc: { views: 1 } },
    { new: true },
  )
    .populate("category", "name")
    .lean();

  if (!note) {
    throw new apiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, note, "Note fetched successfully"));
});
