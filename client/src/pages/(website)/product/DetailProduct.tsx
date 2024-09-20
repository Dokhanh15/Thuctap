import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "src/component/loading/Loading";
import { useStatus } from "src/contexts/Status";
import { useUser } from "src/contexts/user";
import { Product } from "src/types/products";
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
  const [timeLeft, setTimeLeft] = useState<number>(0);

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
        if (data.saleEndDateTime) {
          const saleEnd = new Date(data.saleEndDateTime).getTime();
          setTimeLeft(saleEnd - Date.now());
        }
      } catch (error) {
        toast.error((error as AxiosError)?.message);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };
    getProductDetail(id);
  }, [id, setLoading, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (product && product.saleEndDateTime) {
        const saleEnd = new Date(product.saleEndDateTime).getTime();
        const now = Date.now();
        const newTimeLeft = saleEnd - now;
        if (newTimeLeft <= 0) {
          clearInterval(timer);
          setTimeLeft(0);
        } else {
          setTimeLeft(newTimeLeft);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [product]);

  // Tính toán giá giảm
  const getDiscountedPrice = () => {
    if (product && product.discountPercentage && timeLeft > 0) {
      return product.price - product.price * (product.discountPercentage / 100);
    }
    return null;
  };

  const discountedPrice = getDiscountedPrice();

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

  // Tính toán thời gian còn lại
  const calculateTimeLeft = () => {
    if (timeLeft <= 0) return "Kết thúc";
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col lg:flex-row w-full bg-white rounded-lg shadow-lg p-10 relative"> {/* Added relative positioning */}
          {/* Phần chi tiết sản phẩm */}
          <div className="flex-shrink-0 w-full lg:w-1/2 flex items-center justify-center">
            {product ? (
              <div className="relative"> {/* Added relative positioning */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-auto max-w-md object-cover rounded-lg shadow-md"
                />
                {product.saleEndDateTime && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 text-xs font-bold rounded flex items-center gap-1">
                    SALE{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                      aria-label="Sale Icon"
                    >
                      <path
                        fillRule="evenodd"
                        d="M13.5 4.938a7 7 0 1 1-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 0 1 .572-2.759 6.026 6.026 0 0 1 2.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0 0 13.5 4.938ZM14 12a4 4 0 0 1-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 0 0 1.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 0 1 1.315-4.192.447.447 0 0 1 .431-.16A4.001 4.001 0 0 1 14 12Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <Loading />
            )}
          </div>
          <div className="flex-1 w-full lg:w-1/2 flex flex-col justify-start gap-6">
            {product ? (
              <>
                <h1 className="text-5xl font-extrabold text-gray-800 mb-4">{product.title}</h1>
                <p className="text-lg text-gray-600 mb-4">
                  {product.description ?? "N/A"}
                </p>

                <div className="mb-4">
                  <p className={`text-lg font-bold ${discountedPrice ? "text-gray-500 line-through" : "text-red-600"}`}>
                    Giá gốc: {product.price}$
                  </p>
                  {discountedPrice && (
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      Giá sau giảm: ${discountedPrice.toFixed(2)}
                    </p>
                  )}
                </div>
                {product.saleEndDateTime && (
                  <p className="text-lg text-gray-700 mb-4">
                    Thời gian giảm giá còn lại:{" "}
                    <span className="text-red-600 font-semibold">{calculateTimeLeft()}</span>
                  </p>
                )}

                <p className="mb-4 text-lg font-medium">
                  Danh mục: <span className="font-semibold text-gray-800">{product.category?.name ?? "N/A"}</span>
                </p>
                <p className="mb-4 text-lg font-medium">
                  Đánh giá: <span className="font-semibold text-gray-800">4.8/5</span>
                </p>

                <div className="flex flex-col gap-6 mb-4">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex flex-col w-full mb-4">
                      <label className="text-lg font-medium mb-2 text-gray-700">
                        Chọn size:
                      </label>
                      <div className="flex gap-3">
                        {product.sizes?.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border rounded-md text-sm font-semibold transition duration-300 ease-in-out ${
                              size === selectedSize
                                ? "bg-pink-500 text-white border-pink-600"
                                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-lg font-medium mb-2 text-gray-700">
                        Chọn màu:
                      </label>
                      <div className="flex gap-3">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full border border-gray-300 transition duration-300 ease-in-out ${
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
                    <label className="text-lg font-medium mb-2 text-gray-700">
                      Số lượng:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md w-32">
                      <button
                        onClick={handleDecreaseQuantity}
                        disabled={quantity === 1}
                        className="p-2 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
                      >
                        <FaMinus />
                      </button>
                      <p className="px-4 text-lg font-semibold">{quantity}</p>
                      <button
                        onClick={handleIncreaseQuantity}
                        className="p-2 text-gray-700 hover:bg-gray-200"
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
