import { Router } from "express";
import AuthController from "../controllers/auth";
import authMiddleware from "../middleware/authMiddleware";
import upload from "../config/mulerConfig";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/",authMiddleware, authController.getAllUsers);
authRouter.get("/profile", authMiddleware, authController.getProfile);

// Sử dụng multer để xử lý ảnh tải lên
authRouter.put(
  "/edit/profile",
  authMiddleware,
  upload.single("avatar"),
  authController.updateProfile
);
authRouter.post(
  "/check-password",
  authMiddleware,
  authController.checkPassword
);

export default authRouter;
