import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel";
import { registerValidator, loginValidator } from "../validations/auth";
import ApiError from "../utils/ApiError";
import { getUserByEmail } from "../services/user";

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
  
      // Kiểm tra số lượng người dùng hiện có
      const userCount = await User.countDocuments();
      const role = userCount === 0 ? 'admin' : 'member';  // Đặt role
  
      const user = await User.create({
        email,
        username,
        password: hashPassword,
        role,  // Thêm role 
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

      const checkPassword = await bcryptjs.compare(password, checkUser.password);
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

  async get(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
