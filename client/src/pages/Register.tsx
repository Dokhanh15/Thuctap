import { AxiosError } from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "src/config/configAxios";
import { useLoading } from "src/contexts/loading";
import { Users } from "src/types/user";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Users & { confirmPassword: string }>();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const password = watch("password");

  const onSubmit: SubmitHandler<Users & { confirmPassword: string }> = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/register", data);
      toast.success("Đăng ký thành công!");
      console.log("Đăng ký thành công:", response.data);
      reset();
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
      console.error("Lỗi đăng ký:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg border border-gray-300 shadow-md w-full max-w-md">
        <div className="flex justify-center items-center bg-indigo-800 rounded-full w-16 h-16 mb-4 mx-auto">
          <span role="img" aria-label="lock" className="text-3xl text-white">
            🔒
          </span>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          ĐĂNG KÝ
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tên người dùng
            </label>
            <input
              type="text"
              placeholder="Tên người dùng"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors?.username ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              {...register("username", {
                required: "Vui lòng nhập tên người dùng",
              })}
            />
            {errors?.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Địa chỉ Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors?.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Vui lòng nhập đúng định dạng email",
                },
              })}
            />
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Mật khẩu"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors?.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 6,
                  message: "Mật khẩu có ít nhất 6 ký tự",
                },
              })}
            />
            {errors?.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors?.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              {...register("confirmPassword", {
                required: "Vui lòng xác nhận lại mật khẩu",
                validate: (value) =>
                  value === password || "Mật khẩu không khớp",
              })}
            />
            {errors?.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-800 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 transition-all duration-300"
          >
            Đăng ký
          </button>

          <div className="flex justify-end mt-4">
            <a
              href="/login"
              className="text-sm text-indigo-800 hover:underline"
            >
              Đã có tài khoản? Đăng nhập
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
