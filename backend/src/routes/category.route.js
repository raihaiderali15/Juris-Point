import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category/category.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/createCategory", verifyJwt, createCategory);
router.get("/getAllCategory", getAllCategories);
router.patch("/uptade/:categoryId", verifyJwt, updateCategory);
router.delete("/delete/:categoryId", verifyJwt, deleteCategory);

export default router;