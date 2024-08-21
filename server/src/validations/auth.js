import Joi from "joi";

const registerValidator = Joi.object({
  username: Joi.string().min(3).messages({
    "any.required": "Tên đăng nhập là bắt buộc",
    "string.min": "Tên đăng nhập phải có ít nhất 3 ký tự",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email không đúng định dạng",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().required().messages({
    "any.required": "Mật khẩu là bắt buộc",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Xác nhận mật khẩu không khớp",
    "any.required": "Xác nhận mật khẩu là bắt buộc",
  }),
  role: Joi.string(),
}).options({
  abortEarly: false,
});

const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không đúng định dạng",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().required().messages({
    "any.required": "Mật khẩu là bắt buộc",
  }),
}).options({
  abortEarly: false,
});

export { registerValidator, loginValidator };
