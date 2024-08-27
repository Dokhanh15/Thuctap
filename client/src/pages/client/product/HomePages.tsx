import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useStatus } from "src/contexts/Status";
import { Product } from "src/types/products";
import ListProduct from "./ListProduct";
import AutoSlider from "../user/Slide";
import Loading from "src/component/loading/Loading";
import CategoryList from "../category/Categories";

function Homepage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { setLoading } = useStatus();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [noResults, setNoResults] = useState<boolean>(false);

  const getAllProducts = async (
    category: string | null = null,
    query: string = ""
  ) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/products", {
        params: { category, query },
      });
      setProducts(data);
      setNoResults(data.length === 0);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));
  const boundedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

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
          } hover:bg-gray-200`}
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
        } hover:bg-gray-200`}
      >
        {totalPages}
      </button>
    );

    return buttons;
  };

  return (
    <>
      <div className=" mx-auto my-3">
        <Loading />
        <CategoryList />
        <h2 className=" mx-20 text-center border-b border-black p-5 bg-gray-100">GỢI Ý HÔM NAY</h2>
        <div className="flex flex-wrap justify-center gap-5 p-6">
          {noResults ? (
            <h3 className="text-3xl">Không tìm thấy sản phẩm</h3>
          ) : (
            currentProducts.map((product) => (
              <ListProduct key={product._id} product={product} />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-2">
            {renderPaginationButtons()}
          </div>
        )}
      </div>
    </>
  );
}

export default Homepage;
