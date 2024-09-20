import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { SidebarProps, Users } from "src/types/user";
import { toast } from "react-toastify";
import { useStatus } from "src/contexts/Status";
import { useUser } from "src/contexts/user";
import Modal from "./modal";

const Sidebar: React.FC<SidebarProps> = ({
  user,
  formData,
  isEditing,
  handleChange,
  setIsEditing,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý modal
  const { setLoading } = useStatus();
  const { setUser } = useUser();

  useEffect(() => {
    if (!isEditing.avatar) {
      setSelectedFile(null);
    }
  }, [isEditing.avatar]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          handleChange({
            target: {
              name: "avatar",
              value: reader.result as string,
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (selectedFile) {
      setIsModalOpen(false);
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        await axios.put("/auth/edit/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Cập nhật ảnh thành công!");

        const userResponse = await axios.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        handleChange({
          target: {
            name: "avatar",
            value: userResponse.data.avatar,
          },
        } as React.ChangeEvent<HTMLInputElement>);

        setIsEditing((prev) => ({
          ...prev,
          avatar: false,
        }));
        setUser(userResponse.data as Users);
      } catch (error) {
        console.error("Lỗi khi lưu ảnh:", error);
        toast.error((error as AxiosError)?.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full lg:w-1/5 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          <p>{user?.username}</p>
        </label>
        <div className="flex flex-col items-center">
          {formData.avatar ? (
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-sm">Chưa có ảnh</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)} // Mở modal khi ấn nút
            className="mt-2 px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Chọn ảnh
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* Nội dung chỉnh sửa trong modal */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <div className="flex space-x-2 mt-4">
            <button
              type="button"
              onClick={handleSaveAvatar}
              className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Lưu ảnh
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)} // Đóng modal khi ấn Hủy
              className="px-3 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
