import { Router } from "express";
import { createSize, getAllSizes } from "../controllers/size";

const sizesRouter = Router();

sizesRouter.get("/", getAllSizes);
sizesRouter.post("/", createSize);


export default sizesRouter;
