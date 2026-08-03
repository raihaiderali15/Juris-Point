import asyncHandler from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import Category from "../../models/category.model.js";

// Create Category
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    throw new apiError(400, "Category name is required");
  }

  const existingCategory = await Category.findOne({
    name: name.trim(),
  });

  if (existingCategory) {
    throw new apiError(409, "Category already exists");
  }

  const category = await Category.create({
    name: name.trim(),
  });

  return res
    .status(201)
    .json(new apiResponse(201, category, "Category created successfully"));
});

// Get All Categories
export const getAllCategories = asyncHandler(async (req, res) => {
  const allCategories = await Category.find().sort({ name: 1 });

  return res
    .status(200)
    .json(
      new apiResponse(200, allCategories, "Categories fetched successfully"),
    );
});

// Delete Category
export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    throw new apiError(400, "Category ID is required");
  }

  const deletedCategory = await Category.findByIdAndDelete(categoryId);

  if (!deletedCategory) {
    throw new apiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Category deleted successfully"));
});

//Uptade Category
export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!categoryId) {
    throw new apiError(400, "Category ID is required");
  }

  if (!name?.trim()) {
    throw new apiError(400, "Category name is required");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new apiError(404, "Category not found");
  }

  const existingCategory = await Category.findOne({
    name: name.trim(),
    _id: { $ne: categoryId },
  });

  if (existingCategory) {
    throw new apiError(409, "Category already exists");
  }

  category.name = name.trim();

  await category.save();

  return res.status(200).json(
    new apiResponse(
      200,
      category,
      "Category updated successfully"
    )
  );
});