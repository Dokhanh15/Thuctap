import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "src/contexts/user";
import { useStatus } from "src/contexts/Status";
import { Product } from "src/types/products";
import { toast } from "react-toastify";
import { FaPlus, FaMinus } from "react-icons/fa";
import axios, { AxiosError } from "axios";

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (!id) return;
    const getProductDetail = async (id: string) => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error((error as AxiosError)?.message);
        navigate("/notfound");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
      <div className="flex flex-col md:flex-row items-start bg-white p-10 rounded-lg shadow-lg gap-8 w-full max-w-screen-lg">
        {product ? (
          <>
            <div className="w-full md:w-1/2 lg:w-1/2 flex justify-center items-center">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col justify-start gap-6 text-center md:text-left">
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
                  <div className="flex flex-col w-full">
                    <label className="text-lg font-medium mb-2">Chọn size:</label>
                    <select
                      value={selectedSize ?? ""}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="border border-gray-300 rounded-md p-2"
                    >
                      <option value="">Chọn size</option>
                      {product.sizes?.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-lg font-medium mb-2">Chọn màu:</label>
                    <div className="flex gap-2">
                      {product.colors?.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border border-gray-300 ${color === selectedColor ? 'ring-2 ring-pink-500' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4 mb-2">
                  <p className="text-lg font-medium">Số lượng:</p>
                  <div className="flex items-center border border-gray-300 rounded-md">
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
            </div>
          </>
        ) : (
          <p>Product not found</p>
        )}
      </div>
    </div>
  );
}

export default Detail;
