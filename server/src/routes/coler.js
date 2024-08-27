import { Router } from "express";
import { createColor, getAllColors } from "../controllers/coler";

const colorsRouter = Router();

colorsRouter.get("/", getAllColors);
colorsRouter.post("/", createColor);


export default colorsRouter;
