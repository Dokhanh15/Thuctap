import { Router } from "express";
import ProductsController from "../controllers/products";
import upload from "../config/mulerConfig";
import authMiddleware from "../middleware/authMiddleware";

const productsRouter = Router();

const productsController = new ProductsController();

productsRouter.get("/", productsController.getAllProducts);
productsRouter.get("/:id", productsController.getProductDetail);
productsRouter.post("/",authMiddleware, upload.single('image'), productsController.createProduct);
productsRouter.put("/:id",authMiddleware,upload.single('image'), productsController.updateProduct);
productsRouter.delete("/:id",authMiddleware, productsController.deleteProduct);

export default productsRouter;
