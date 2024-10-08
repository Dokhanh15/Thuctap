import { Router } from "express";
import AuthController from "../controllers/auth";
import upload from "../config/mulerConfig";
import authMiddleware from "../middleware/authMiddleware";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/",authMiddleware, authController.getAllUsers);
authRouter.get("/profile", authMiddleware, authController.getProfile);
authRouter.put("/edit/profile",authMiddleware,upload.single("avatar"),authController.updateProfile);
authRouter.post("/check-password",authMiddleware,authController.checkPassword);
authRouter.post('/lock/:id',  authController.lockUser);
authRouter.post('/unlock/:id', authController.unlockUser);

export default authRouter;
