import { Router } from "express";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import colorsRouter from "./coler";
import sizesRouter from "./size";

const router = Router();

router.get("/", (req, res) => {
  res.send("Home");
});

router.use("/auth", authRouter);
router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);
router.use("/colors", colorsRouter);  
router.use("/sizes", sizesRouter);

export default router;
