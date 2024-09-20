import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import filter from "src/assets/img/more.png";
import searchIcon from "src/assets/img/search.png";
import { useStatus } from "src/contexts/Status";
import { Category, Product } from "src/types/products";
import { toast } from "react-toastify";
import ConfirmDialog from "src/component/confirm/ConfirmDialog";
import Loading from "src/component/loading/Loading";

const AdminProductList = () => {
  const { setLoading } = useStatus();
  const [confirm, setConfirm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [idDelete, setIdDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(8);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [search, setSearch] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [timeLefts, setTimeLefts] = useState<{ [key: string]: number }>({});

  const getAllProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/products");
      let filteredData = data;
      if (selectedCategory) {
        filteredData = filteredData.filter(
          (product: Product) => product.category?.name === selectedCategory
        );
      }
      setProducts(filteredData);
      // Initialize countdown times
      const now = new Date().getTime();
      const initialTimeLefts = filteredData.reduce(
        (acc: { [key: string]: number }, product: Product) => {
          const saleEndDate = new Date(product.saleEndDateTime || 0).getTime();
          const timeLeft = Math.max(0, saleEndDate - now);
          acc[product._id] = timeLeft;
          return acc;
        },
        {}
      );
      setTimeLefts(initialTimeLefts);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
      console.log("Có lỗi xảy ra, vui lòng thử lại sau!", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProduct();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/categories");
        setCategories(data);
      } catch (error) {
        toast.error((error as AxiosError)?.message);
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLefts((prevTimeLefts) => {
        const now = new Date().getTime();
        const updatedTimeLefts = { ...prevTimeLefts };
        Object.keys(updatedTimeLefts).forEach((productId) => {
          const saleEndDate = new Date(
            products.find((product) => product._id === productId)
              ?.saleEndDateTime || 0
          ).getTime();
          updatedTimeLefts[productId] = Math.max(0, saleEndDate - now);
        });
        return updatedTimeLefts;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  const filterProducts = () => {
    let filteredData = products;
    if (search) {
      filteredData = filteredData.filter((product: { title: string }) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory) {
      filteredData = filteredData.filter(
        (product: Product) => product.category?.name === selectedCategory
      );
    }
    return filteredData;
  };

  const filteredProducts = filterProducts();

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  );
  const boundedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const indexOfLastProduct = boundedCurrentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleConfirm = (id: string) => {
    setConfirm(true);
    setIdDelete(id);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setConfirm(false);
      const token = localStorage.getItem("token");
      await axios.delete(`/products/${idDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAllProduct();
      toast.success("Xóa sản phẩm thành công!");
      setConfirm(false);
      setIdDelete(null);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
      console.error("Error deleting product", error);
    } finally {
      setLoading(false);
    }
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSearchIconClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
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
          }`}
        >
          1
        </button>
      );
    }

    if (boundedCurrentPage > 3 && totalPages > 1) {
      buttons.push(
        <span key="start-ellipsis">
          <MoreHorizIcon />
        </span>
      );
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
          }`}
        >
          {number}
        </button>
      );
    }

    if (boundedCurrentPage < totalPages - 2) {
      buttons.push(
        <span key="end-ellipsis">
          <MoreHorizIcon />
        </span>
      );
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
          <h3 className="text-center text-5xl">Danh sách sản phẩm</h3>
          <>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <IconButton onClick={handleFilterClick}>
                  <img src={filter} width={25} alt="filter" />
                </IconButton>
                <Menu
                  anchorEl={filterAnchorEl}
                  open={Boolean(filterAnchorEl)}
                  onClose={handleFilterClose}
                >
                  <MenuItem
                    className="relative overflow-hidden"
                    onClick={() => {
                      setSelectedCategory(null);
                      handleFilterClose();
                      getAllProduct();
                    }}
                  >
                    Tất cả sản phẩm
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem
                      key={category._id}
                      className="relative overflow-hidden"
                      onClick={() => {
                        setSelectedCategory(category.name);
                        handleFilterClose();
                        getAllProduct();
                      }}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Menu>
              </div>

              <div className="flex gap-2 items-center">
                <div className="relative flex items-center">
                  <IconButton onClick={handleSearchIconClick}>
                    <img src={searchIcon} width={25} alt="search" />
                  </IconButton>
                  <input
                    type="text"
                    className={`transition-width duration-500 ${
                      isSearchVisible
                        ? "w-48 opacity-100 ml-2"
                        : "w-0 opacity-0"
                    } border-b-2 border-pink-600`}
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Tìm kiếm sản phẩm"
                  />
                </div>

                <Link to="/admin/product/add" className="w-48">
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center">
                    <AddIcon /> Thêm sản phẩm
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full text-center">
                <thead className=" bg-zinc-300">
                  <tr className="border-b">
                    <th className="py-3 px-4">Tiêu đề</th>
                    <th className="py-3 px-4">Ảnh</th>
                    <th className="py-3 px-4">Giá</th>
                    <th className="py-3 px-4">% giảm giá</th>
                    <th className="py-3 px-4">Thời gian giảm giá</th>
                    <th className="py-3 px-4">Mô tả</th>
                    <th className="py-3 px-4">Danh mục</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product._id} className="bg-white border-b">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {product.title}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900 flex justify-center">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-24 h-20 object-cover rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.saleEndDateTime &&
                          timeLefts[product._id] > 0 ? (
                            <>
                              <span className="line-through text-gray-500">
                                ${product.price.toLocaleString()}
                              </span>
                              <br />
                              <span className="text-red-600 font-bold">
                                $
                                {product.discountPercentage
                                  ? (
                                      product.price -
                                      (product.price *
                                        product.discountPercentage) /
                                        100
                                    ).toLocaleString()
                                  : product.price.toLocaleString()}{" "}
                              </span>
                            </>
                          ) : (
                            <span>${product.price.toLocaleString()}</span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.saleEndDateTime &&
                          timeLefts[product._id] > 0 ? (
                            <span className="text-green-600 font-bold">
                              {product.discountPercentage
                                ? `${product.discountPercentage}%`
                                : "---"}
                            </span>
                          ) : (
                            <span>---</span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.saleEndDateTime ? (
                            timeLefts[product._id] > 0 ? (
                              <span>
                                {Math.floor(
                                  timeLefts[product._id] / (1000 * 60 * 60 * 24)
                                )}{" "}
                                ngày{" "}
                                {Math.floor(
                                  (timeLefts[product._id] %
                                    (1000 * 60 * 60 * 24)) /
                                    (1000 * 60 * 60)
                                )}{" "}
                                giờ{" "}
                                {Math.floor(
                                  (timeLefts[product._id] % (1000 * 60 * 60)) /
                                    (1000 * 60)
                                )}{" "}
                                phút{" "}
                                {Math.floor(
                                  (timeLefts[product._id] % (1000 * 60)) / 1000
                                )}{" "}
                                giây
                              </span>
                            ) : (
                              <span className="text-gray-800">---</span>
                            )
                          ) : (
                            <span className="text-gray-800">---</span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {product.description}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {product.category?.name}
                        </td>

                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/admin/product/edit/${product._id}`}
                              className="bg-yellow-500 text-white p-2 rounded-md"
                            >
                              <EditIcon />
                            </Link>
                            <IconButton
                              onClick={() => handleConfirm(product._id)}
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
                        colSpan={7}
                        className="py-4 px-6 text-sm font-medium text-gray-900"
                      >
                        <Loading />
                        Không tìm thấy sản phẩm nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-center">
              {renderPaginationButtons()}
            </div>
          </>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        title="Xác nhận xóa sản phẩm"
        content="Bạn có chắc chắn muốn xóa sản phẩm này không?"
        cancelText="Hủy bỏ"
        confirmText="Xóa"
        onClose={() => setConfirm(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default AdminProductList;
