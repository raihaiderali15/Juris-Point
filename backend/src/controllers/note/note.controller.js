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
//uptade Notes
export const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findById(id);

  if (!note) {
    throw new apiError(404, "Note not found");
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
    note.category = category;
  }

  if (tags !== undefined) {
    note.tags = tags
      .split(",")
      .map(tag => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  if (accessLevel !== undefined) {
    note.accessLevel = accessLevel;
  }

  if (author !== undefined) {
    note.author = author.trim();
  }

  if (isPublished !== undefined) {
    note.isPublished =
      isPublished === true || isPublished === "true";
  }

  await note.save();

  return res
    .status(200)
    .json(
      new apiResponse(200, note, "Note updated successfully")
    );
});
//Delete Notes
export const deleteNotes=asyncHandler(async(req,res,next)=>{
  const noteId=req.params.id;
  const note=await Note.findById(noteId);
  if(!note){
    throw new apiError(404,"Note not found");
  }
 await removeFromCloudinary(note.file.publicId,"raw");
 const deletedNote=await Note.findByIdAndDelete(noteId);
  return res.status(200).json(new apiResponse(200,deletedNote,"Note deleted successfully"))
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
//Get note by ID
export const getNoteById = asyncHandler(async (req, res, next) => {
  const noteId = req.params.id;
  const note = await Note.findByIdAndUpdate(noteId,{$inc:{views:1}},{new:true}).populate("category","name").lean();
  if (!note) {
    throw new apiError(404, "Note not found");
  }
  return res
    .status(200)
    .json(new apiResponse(200, note, "Note fetched successfully"));
});
