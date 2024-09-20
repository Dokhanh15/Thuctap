import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import searchIcon from "src/assets/img/search.png";
import ConfirmDialog from "src/component/confirm/ConfirmDialog";
import Loading from "src/component/loading/Loading";
import { useStatus } from "src/contexts/Status";
import useCategory from "src/Hooks/useCategories";

const AdminCategoryList = () => {
  const { categories, fetchCategories } = useCategory();
  const [confirm, setConfirm] = useState(false);
  const [idDelete, setIdDelete] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categoriesPerPage] = useState<number>(8);
  const { setLoading } = useStatus();

  const handleConfirm = (id: string) => {
    setConfirm(true);
    setIdDelete(id);
  };

  const handleDelete = async () => {
    try {
      setConfirm(false);
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.delete(`/categories/${idDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Xóa danh mục thành công!");
      fetchCategories();
      setConfirm(false);
      setIdDelete(null);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
      console.error("Error deleting category", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / categoriesPerPage)
  );
  const boundedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const indexOfLastCategory = boundedCurrentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    // Always show the first page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={`px-2 py-1 min-w-[40px] rounded-md ${
            1 === boundedCurrentPage
              ? "bg-black text-white font-bold"
              : "bg-white text-black"
          } `}
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

    // Always show the last page
    buttons.push(
      <button
        key={totalPages}
        onClick={() => paginate(totalPages)}
        className={`px-2 py-1 min-w-[40px] rounded-md ${
          totalPages === boundedCurrentPage
            ? "bg-black text-white font-bold"
            : "bg-white text-black"
        } `}
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
          <h3 className="text-center text-5xl">Danh sách danh mục</h3>
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
                  placeholder="Tìm kiếm danh mục"
                />
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <Link to="/admin/category/add" className="w-48">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center">
                  <AddIcon /> Thêm danh mục
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full text-center">
              <thead className="bg-zinc-300">
                <tr className="border-b">
                  <th className="py-3 px-4">Ảnh danh mục</th>
                  <th className="py-3 px-4">Tên danh mục</th>
                  <th className="py-3 px-4">Mô tả</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.length > 0 ? (
                  currentCategories.map((category) => (
                    <tr key={category._id} className="bg-white border-b">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 flex justify-center">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-24 h-20 object-cover rounded-md"
                        />
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {category.description}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/admin/category/edit/${category._id}`}
                            className="bg-yellow-500 text-white p-2 rounded-md"
                          >
                            <EditIcon />
                          </Link>
                          <IconButton
                            onClick={() => handleConfirm(category._id)}
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
                            <DeleteForeverIcon />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 px-6 text-sm font-medium text-gray-900"
                    >
                      <Loading />
                      Không tìm thấy danh mục nào.
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
        title="Xác nhận xóa danh mục"
        content="Bạn có chắc chắn muốn xóa danh mục này không?"
        cancelText="Hủy bỏ"
        confirmText="Xóa"
        onConfirm={handleDelete}
        onClose={() => setConfirm(false)}
      />
    </>
  );
};

export default AdminCategoryList;
