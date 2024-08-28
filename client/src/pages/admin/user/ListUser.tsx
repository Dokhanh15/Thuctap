import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { IconButton } from "@mui/material";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import searchIcon from "src/assets/img/search.png";
import ConfirmDialog from "src/component/confirm/ConfirmDialog";
import Loading from "src/component/loading/Loading";
import { useStatus } from "src/contexts/Status";
import { Users } from "src/types/user";

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [idLock, setIdLock] = useState<string | null>(null);
  const [unlockConfirm, setUnlockConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(8);
  const { setLoading } = useStatus();

  // Fetch users data from API
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
      toast.error((error as AxiosError)?.message || "Lỗi không xác định");
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle confirmation dialog for locking a user
  const handleConfirm = (id: string) => {
    setConfirm(true);
    setIdLock(id);
  };

  // Handle locking a user
  const handleLock = async () => {
    try {
      setLoading(true);
      if (idLock) {
        await axios.post(`/auth/lock/${idLock}`);
        toast.success("Khóa tài khoản thành công!");
        fetchUsers();
        setConfirm(false);
        setIdLock(null);
      }
    } catch (error) {
      toast.error((error as AxiosError)?.message || "Lỗi không xác định");
      console.error("Error locking user", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý mở khóa tài khoản
  const handleUnlockConfirm = (id: string) => {
    setUnlockConfirm(id);
  };

  // Handle unlocking a user
  const handleUnlock = async () => {
    try {
      setLoading(true);
      if (unlockConfirm) {
        await axios.post(`/auth/unlock/${unlockConfirm}`);
        toast.success("Mở khóa tài khoản thành công!");
        fetchUsers();
        setUnlockConfirm(null);
      }
    } catch (error) {
      toast.error((error as AxiosError)?.message || "Lỗi không xác định");
      console.error("Error unlocking user", error);
    } finally {
      setLoading(false);
    }
  };
  // Handle search icon click
  const handleSearchIconClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
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

  // Render pagination buttons
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
          }`}
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
          } `}
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
        }`}
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
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 flex justify-center ">
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
                        {user.phone || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {user.role || "User"}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 flex items-center space-x-2">
                        {user.isLocked ? (
                          <>
                            <IconButton
                              onClick={() => handleUnlockConfirm(user._id)}
                            >
                              < LockIcon style={{ color: "red" }} />
                            </IconButton>
                            <span className="text-red-500">
                              Đã khóa tài khoản
                            </span>
                          </>
                        ) : (
                          <IconButton onClick={() => handleConfirm(user._id)}>
                            <LockOpenIcon style={{ color: "green" }} />
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      <Loading />
                      Không có người dùng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="py-4 flex justify-center">
              {renderPaginationButtons()}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        title="Xác nhận khóa tài khoản"
        content="Bạn có chắc chắn muốn khóa tài khoản này không?"
        cancelText="Hủy bỏ"
        confirmText="Khóa"
        onClose={() => setConfirm(false)}
        onConfirm={handleLock}
      />

      <ConfirmDialog
        open={unlockConfirm !== null}
        title="Xác nhận mở khóa tài khoản"
        content="Bạn có chắc chắn muốn mở khóa tài khoản này không?"
        cancelText="Hủy bỏ"
        confirmText="Mở khóa"
        onClose={() => setUnlockConfirm(null)}
        onConfirm={handleUnlock}
      />
    </>
  );
};

export default AdminUserList;
