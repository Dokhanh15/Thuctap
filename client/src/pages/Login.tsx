import { AxiosError } from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "src/config/configAxios";
import { useLoading } from "src/contexts/loading";
import { useUser } from "src/contexts/user";
import { Users } from "src/types/user";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Users>();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const onSubmit: SubmitHandler<Users> = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", data);
      toast.success("Đăng nhập thành công!");
      console.log("Đăng nhập thành công:", response.data);
      
      const user = response.data.user;
      const token = response.data.token;

      localStorage.setItem("token", token);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      reset();

      // Chuyển hướng dựa trên role của người dùng
      if (user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error((error as AxiosError)?.message);
      console.error("Lỗi đăng nhập:", error);
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
          ĐĂNG NHẬP
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="Password"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors?.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 5,
                  message: "Mật khẩu ít nhất 5 ký tự",
                },
              })}
            />
            {errors?.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-900 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 transition-all duration-300"
          >
            Đăng nhập
          </button>

          <div className="flex justify-end mt-4">
            <a
              href="/register"
              className="text-sm text-indigo-800 hover:underline"
            >
              Chưa có tài khoản? Đăng ký
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
