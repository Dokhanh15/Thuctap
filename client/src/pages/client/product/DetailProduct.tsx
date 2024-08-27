import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "src/contexts/user";
import { useStatus } from "src/contexts/Status";
import { Product } from "src/types/products";
import { toast } from "react-toastify";
import { FaPlus, FaMinus } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import Loading from "src/component/loading/Loading";
import CommentSection from "./Comment";

const GradientButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg shadow-md py-2 px-6 mt-5 hover:bg-gradient-to-l hover:from-pink-700 hover:to-red-700"
  >
    {children}
  </button>
);

function Detail() {
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLoading } = useStatus();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]); // State để lưu màu sắc từ backend
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const { data } = await axios.get(`/colors`);
        setColors(data.map((color: any) => color.hex)); // Giả sử `hex` là mã màu
      } catch (error) {
        toast.error((error as AxiosError)?.message);
      }
    };

    fetchColors();
  }, []);

  useEffect(() => {
    if (!id) return;
    const getProductDetail = async (id: string) => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error((error as AxiosError)?.message);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };
    getProductDetail(id);
  }, [id, setLoading, navigate]);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (quantity <= 0 || !selectedSize || !selectedColor) return;

    try {
      // addToCart({ product, quantity, size: selectedSize, color: selectedColor });
      setSnackbar({
        open: true,
        message: "Thêm vào giỏ hàng thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to add to cart", error);
      setSnackbar({
        open: true,
        message: "Không thêm được sản phẩm vào giỏ hàng!",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col lg:flex-row w-full bg-white rounded-lg shadow-lg p-10">
          {/* Phần chi tiết sản phẩm */}
          <div className="flex-shrink-0 w-full lg:w-1/2 flex items-center justify-center">
            {product ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto max-w-sm object-cover rounded-lg" 
              />
            ) : (
              <Loading />
            )}
          </div>
          <div className="flex-1 w-full lg:w-1/2 flex flex-col justify-start gap-6">
            {product ? (
              <>
                <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
                <p className="text-lg mb-2">
                  Mô tả: {product.description ?? "N/A"}
                </p>
                <p className="text-red-600 text-2xl font-bold mb-2">
                  Giá: {product.price}$
                </p>
                <p className="mb-2">
                  Danh mục: {product.category?.name ?? "N/A"}
                </p>
                <p className="mb-2">Đánh giá: 4.8/5</p>

                <div className="flex flex-col gap-6 mb-2">
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className="flex flex-col w-full mb-4">
                      <label className="text-lg font-medium mb-2">
                        Chọn size:
                      </label>
                      <div className="flex gap-2">
                        {product.sizes?.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border rounded-md text-sm ${
                              size === selectedSize
                                ? "bg-pink-500 text-white border-pink-500"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-lg font-medium mb-2">
                        Chọn màu:
                      </label>
                      <div className="flex gap-2">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full border border-gray-300 ${
                              color === selectedColor
                                ? "ring-2 ring-gray-800"
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-lg font-medium mb-2">
                      Số lượng:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md w-28">
                      <button
                        onClick={handleDecreaseQuantity}
                        disabled={quantity === 1}
                        className="p-2 text-gray-700 disabled:opacity-50"
                      >
                        <FaMinus />
                      </button>
                      <p className="px-4">{quantity}</p>
                      <button
                        onClick={handleIncreaseQuantity}
                        className="p-2 text-gray-700"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>

                <GradientButton onClick={() => handleAddToCart(product)}>
                  Thêm vào giỏ hàng
                </GradientButton>
              </>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>

      {product && <CommentSection />}
    </div>
  );
}

export default Detail;
