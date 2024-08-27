import React, { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { Users } from "src/types/user";
import { toast } from "react-toastify";
import { useStatus } from "src/contexts/Status";
import Loading from "src/component/loading/Loading";
import Sidebar from "./sidebar";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<Users | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    phone: "",
    gender: "",
  });
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    avatar: false,
    password: false,
    phone: false,
    gender: false,
  });

  const { setLoading } = useStatus();
  const [error, setError] = useState<string>("");
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          avatar: response.data.avatar || "",
          phone: response.data.phone || "",
          gender: response.data.gender || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        toast.error((err as AxiosError)?.message);
        setError("Không thể lấy thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
  
      // Kiểm tra mật khẩu xác nhận
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setError("Mật khẩu và xác nhận mật khẩu không khớp.");
        return;
      }
  
      try {
        setLoading(true);
        setError("");
  
        // Gửi yêu cầu cập nhật thông tin người dùng
        const response = await axios.put(
          "/auth/edit/profile",
          {
            username: formData.username,
            email: formData.email,
            avatar: formData.avatar,
            phone: formData.phone,
            gender: formData.gender,
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        // Cập nhật thông tin người dùng thành công
        setUser(response.data.user);
        toast.success("Cập nhật thông tin thành công!");
        setIsEditing({
          username: false,
          email: false,
          avatar: false,
          password: false,
          phone: false,
          gender: false,
        });
        setFormData((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setShowPasswordForm(false);
      } catch (err) {
        toast.error((err as AxiosError).message);
        setError("Mật khẩu cũ không chính xác!");
      } finally {
        setLoading(false);
      }
    },
    [formData, setLoading, token]
  );
  
  return (
    <div className=" py-10">
      <div className="container mx-auto p-6 gap-3 max-w-6xl flex bg-gray-50 rounded-lg shadow-md">
        {/* Sidebar */}

        <Sidebar
          user={user}
          formData={formData}
          isEditing={isEditing}
          handleChange={handleChange}
          setIsEditing={setIsEditing}
        />
        {/* User Profile */}
        <div className="w-3/4 lg:w-4/5 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-4 text-center border-b p-3">
            Thông tin cá nhân
          </h2>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            {isEditing.username ? (
              <div className="flex items-center">
                <label className="w-1/4 text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <label className="w-1/4 text-gray-700">Username</label>
                <span className="w-3/4">{user?.username}</span>
              </div>
            )}

            {/* Email */}
            {isEditing.email ? (
              <div className="flex items-center">
                <label className="w-1/4 text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <label className="w-1/4 text-gray-700">Email</label>
                <span className="w-3/4">{user?.email}</span>
              </div>
            )}

            {/* Phone */}
            {isEditing.phone ? (
              <div className="flex items-center">
                <label className="w-1/4 text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <label className="w-1/4 text-gray-700">Số điện thoại</label>
                <span className="w-3/4">
                  {user?.phone || "Chưa có thông tin"}
                </span>
              </div>
            )}

            {/* Gender */}
            {isEditing.gender ? (
              <div className="flex items-center">
                <label className="w-1/4 text-gray-700">Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="nam">Nam</option>
                  <option value="nữ">Nữ</option>
                  <option value="khác">Khác</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center">
                <label className="w-1/4 text-gray-700">Giới tính</label>
                <span className="w-3/4">
                  {user?.gender || "Chưa có thông tin"}
                </span>
              </div>
            )}

            {/* Edit and Cancel Buttons */}
            <Loading />
            <div className="flex items-center justify-between">
              {isEditing.username ||
              isEditing.email ||
              isEditing.phone ||
              isEditing.gender ? (
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() =>
                      setIsEditing({
                        username: false,
                        email: false,
                        avatar: false,
                        password: false,
                        phone: false,
                        gender: false,
                      })
                    }
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setIsEditing({
                      username: true,
                      email: true,
                      avatar: false,
                      password: false,
                      phone: true,
                      gender: true,
                    })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            {/* Password Change */}
            {showPasswordForm ? (
              <div className="mt-4 p-4 border border-gray-300 rounded">
                <h3 className="text-lg font-semibold mb-2">
                  Thay đổi mật khẩu
                </h3>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Mật khẩu cũ
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPasswordForm(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Thay đổi mật khẩu
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
