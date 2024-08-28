import { Router } from "express";
import CategoriesController from "../controllers/categories";
import upload from "../config/mulerConfig";
import authMiddleware from "../middleware/authMiddleware";

const categoriesRouter = Router();

const categoriesController = new CategoriesController();

categoriesRouter.get("/", categoriesController.getAllCategories);
categoriesRouter.get("/:id", categoriesController.getCategoryDetail);
categoriesRouter.post("/",authMiddleware,upload.single('image'), categoriesController.createCategory);
categoriesRouter.put("/:id",authMiddleware,upload.single('image'), categoriesController.updateCategory);
categoriesRouter.delete("/:id",authMiddleware, categoriesController.deleteCategory);

export default categoriesRouter;
