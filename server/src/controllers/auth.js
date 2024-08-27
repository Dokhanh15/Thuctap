import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel";
import { registerValidator, loginValidator } from "../validations/auth";
import ApiError from "../utils/ApiError";
import { getUserByEmail } from "../services/user";
import fs from 'fs';
import cloudinary from "../config/cloudinary";

class AuthController {
  async register(req, res, next) {
    try {
      const { email, username, password, confirmPassword } = req.body;
      const { error } = registerValidator.validate(req.body);
      if (error) {
        const errors = error.details.map((err) => err.message).join(", ");
        throw new ApiError(StatusCodes.BAD_REQUEST, errors);
      }
      if (password !== confirmPassword) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Mật khẩu không khớp");
      }
      const emailExist = await getUserByEmail(email);
      if (emailExist)
        throw new ApiError(StatusCodes.BAD_REQUEST, "Email đã được đăng ký");

      const hashPassword = await bcryptjs.hash(password, 10);

      const userCount = await User.countDocuments();
      const role = userCount === 0 ? "admin" : "member";

      const user = await User.create({
        email,
        username,
        password: hashPassword,
        role,
      });

      res.status(StatusCodes.OK).json({
        message: "Tạo tài khoản thành công",
        data: { ...user.toObject(), password: undefined },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { error } = loginValidator.validate(req.body);
      if (error) {
        const errors = error.details.map((err) => err.message).join(", ");
        throw new ApiError(StatusCodes.BAD_REQUEST, errors);
      }
      const checkUser = await getUserByEmail(email);
      if (!checkUser)
        throw new ApiError(StatusCodes.BAD_REQUEST, "Tài khoản không hợp lệ");

      const checkPassword = await bcryptjs.compare(
        password,
        checkUser.password
      );
      if (!checkPassword)
        throw new ApiError(StatusCodes.BAD_REQUEST, "Tài khoản không hợp lệ");

      const token = jwt.sign({ id: checkUser._id }, process.env.SECRET_KEY, {
        expiresIn: "1w",
      });
      res.status(StatusCodes.OK).json({
        message: "Đăng nhập thành công",
        user: { ...checkUser.toObject(), password: undefined },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      // Kiểm tra quyền người dùng
      if (!req.user || !req.user._id) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
      }

      // Lấy tất cả người dùng từ cơ sở dữ liệu
      const users = await User.find().select("-password");

      // Kiểm tra xem có người dùng nào không
      if (!users || users.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No users found");
      }

      // Trả về danh sách người dùng
      res.status(StatusCodes.OK).json(users);
    } catch (error) {
      next(error);
    }
  }
  

  async getProfile(req, res, next) {
    try {
      if (!req.user || !req.user._id) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
      }
      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  }


  async updateProfile(req, res, next) {
    const { username, email, phone, gender, oldPassword, newPassword } = req.body;
    const avatar = req.file ? req.file.path : null; // Lấy đường dẫn tạm thời
  
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }
  
      // Kiểm tra mật khẩu cũ và cập nhật mật khẩu mới
      if (oldPassword && newPassword) {
        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: "Mật khẩu cũ không đúng." });
        }
  
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(newPassword, salt);
      }
  
      if (username) user.username = username;
      if (email) user.email = email;
      if (avatar) {
        // Upload ảnh lên Cloudinary
        try {
          const result = await cloudinary.uploader.upload(avatar, {
            folder: 'avatars',
          });
          user.avatar = result.secure_url; // Lưu URL ảnh vào cơ sở dữ liệu
  
          // Xóa ảnh tạm sau khi upload lên Cloudinary
          fs.unlinkSync(avatar);
        } catch (uploadError) {
          console.error("Lỗi khi upload ảnh lên Cloudinary:", uploadError);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi khi upload ảnh lên Cloudinary." });
        }
      }
      if (phone) user.phone = phone;
      if (gender) user.gender = gender;
  
      await user.save();
  
      res.json({ user: { ...user.toObject(), password: undefined } });
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Có lỗi xảy ra khi cập nhật hồ sơ." });
    }
  }
  

  
  async checkPassword(req, res, next) {
    try {
      const { oldPassword } = req.body;

      if (!req.user || !req.user._id) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
      }

      const user = await User.findById(req.user._id);

      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      const isOldPasswordValid = await bcryptjs.compare(
        oldPassword,
        user.password
      );

      res.status(StatusCodes.OK).json({ isValid: isOldPasswordValid });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
