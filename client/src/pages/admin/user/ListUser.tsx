import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import searchIcon from "src/assets/img/search.png";
import { toast } from "react-toastify";
import ConfirmDialog from "src/component/confirm/ConfirmDialog";
import { useStatus } from "src/contexts/Status";

const AdminUserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [idLock, setIdLock] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(8);
  const { setLoading } = useStatus();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); 
      const response = await axios.get("/auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleConfirm = (id: string) => {
    setConfirm(true);
    setIdLock(id);
  };

  const handleLock = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/users/lock/${idLock}`);
      toast.success("Khóa tài khoản thành công!");
      fetchUsers();
      setConfirm(false);
      setIdLock(null);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
      console.error("Error locking user", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage)
  );
  const boundedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const indexOfLastUser = boundedCurrentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    if (totalPages > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={`px-2 py-1 min-w-[40px] rounded-md ${
            1 === boundedCurrentPage
              ? "bg-black text-white font-bold"
              : "bg-white text-black"
          } hover:bg-gray-200`}
        >
          1
        </button>
      );
    }

    if (boundedCurrentPage > 3 && totalPages > 1) {
      buttons.push(<span key="start-ellipsis">...</span>);
    }

    const startPage = Math.max(2, boundedCurrentPage - 1);
    const endPage = Math.min(totalPages - 1, boundedCurrentPage + 1);

    for (let number = startPage; number <= endPage; number++) {
      buttons.push(
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-2 py-1 min-w-[40px] rounded-md ${
            number === boundedCurrentPage
              ? "bg-black text-white font-bold"
              : "bg-white text-black"
          } hover:bg-gray-200`}
        >
          {number}
        </button>
      );
    }

    if (boundedCurrentPage < totalPages - 2) {
      buttons.push(<span key="end-ellipsis">...</span>);
    }

    buttons.push(
      <button
        key={totalPages}
        onClick={() => paginate(totalPages)}
        className={`px-2 py-1 min-w-[40px] rounded-md ${
          totalPages === boundedCurrentPage
            ? "bg-black text-white font-bold"
            : "bg-white text-black"
        } hover:bg-gray-200`}
      >
        {totalPages}
      </button>
    );

    return buttons;
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="space-y-4">
          <h3 className="text-center text-5xl">Danh sách người dùng</h3>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative flex items-center">
                <IconButton onClick={handleSearchIconClick}>
                  <img src={searchIcon} width={25} alt="search" />
                </IconButton>
                <input
                  type="text"
                  className={`transition-width duration-500 ${
                    isSearchVisible ? "w-48 opacity-100 ml-2" : "w-0 opacity-0"
                  } border-b-2 border-pink-600`}
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm người dùng"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full text-center">
              <thead className="bg-zinc-300">
                <tr className="border-b">
                  <th className="py-3 px-4">Avatar</th>
                  <th className="py-3 px-4">Tên người dùng</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Số điện thoại</th>
                  <th className="py-3 px-4">Quyền</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user._id} className="bg-white border-b">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 flex justify-center">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-24 h-20 object-cover rounded-full"
                        />
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {user.phone || "Chưa có"}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {user.role || "Chưa có"}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        <div className="flex justify-center gap-2">
                          <IconButton
                            onClick={() => handleConfirm(user._id)}
                            sx={{
                              backgroundColor: "error.main",
                              color: "common.white",
                              p: 1,
                              borderRadius: "8px",
                              transition: "background-color 0.3s",
                              "&:hover": {
                                backgroundColor: "error.dark",
                              },
                            }}
                          >
                            <LockIcon />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-6 text-sm font-medium text-gray-900"
                    >
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center">
            {renderPaginationButtons()}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        title="Xác nhận khóa tài khoản"
        content="Bạn có chắc chắn muốn khóa tài khoản này không?"
        cancelText="Hủy bỏ"
        confirmText="Khóa"
        onConfirm={handleLock}
        onClose={() => setConfirm(false)}
      />
    </>
  );
};

export default AdminUserList;
