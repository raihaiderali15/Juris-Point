import Note from "../../models/note.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { uploadOnCloudinary } from "../../utils/uploadOnCloundinary.js";
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
  isPublished
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
 const response =await uploadOnCloudinary(localPathofPdf, "raw", "jurispoint/pdf");  
 const parsedTags=tags.split(",").map(tag=>tag.trim()).filter(Boolean)

  const note = await Note.create({
    title,
    description,
    category,
    tags:parsedTags,
    accessLevel,
    author,
    isPublished: isPublished === "true",
    uploadedBy: req.user?._id,
    file: {
      url: response.secure_url,
      publicId: response.public_id,
      originalName:req.file?.originalname,
      format: req.file?.fieldname,
      size: response.bytes,
 
  }
})
  return res.status(201).json(
    new apiResponse(201, note, "Note created successfully")
  );
} )
//Get all Notes
export const getAllNotes=asyncHandler(async(req,res,next)=>{
  const {}
  await Note.find().limit().skip().page();

})