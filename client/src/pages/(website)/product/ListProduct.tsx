import { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "src/contexts/user";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axiosInstance from "src/config/configAxios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Product } from "src/types/products";
import { useProductCart } from "src/Hooks/CartProducts";

type ProductCardProps = {
  product: Product;
};

const ListProduct: FC<ProductCardProps> = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [quantity] = useState<number>(1);
  const [liked, setLiked] = useState(false);
  const { addToCart } = useProductCart();
  const [timeLefts, setTimeLefts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const checkLikedStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosInstance.get("/userlike/liked-products", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const likedProducts = response.data.map((item: Product) => item._id);
          setLiked(likedProducts.includes(product._id));
        } catch (error) {
          console.error("Lỗi khi lấy sản phẩm đã thích:", error);
        }
      }
    };

    checkLikedStatus();
  }, [product._id]);

  useEffect(() => {
    const updateTimeLeft = () => {
      if (product.saleEndDateTime) {
        const saleEnd = new Date(product.saleEndDateTime).getTime();
        const now = new Date().getTime();
        const timeLeft = Math.max(0, saleEnd - now);
        setTimeLefts((prev) => ({ ...prev, [product._id]: timeLeft }));
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [product.saleEndDateTime, product._id]);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleLikeClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này.");
      navigate("/login");
      return;
    }

    try {
      if (liked) {
        await axiosInstance.post(
          `/userlike/unlike/${product._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Đã bỏ thích sản phẩm");
        setLiked(false);
      } else {
        await axiosInstance.post(
          `/userlike/like/${product._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Đã thích sản phẩm");
        setLiked(true);
      }
    } catch (err) {
      console.error("Error in handleLikeClick:", err);
      toast.error((err as AxiosError)?.message || "Có lỗi xảy ra!");
    }
  };

  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    event.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    if (quantity <= 0) return;

    addToCart({ product, quantity });
    toast.success("Thêm vào giỏ hàng thành công!");
  };

  const formatTimeLeft = (timeLeft: number) => {
    if (timeLeft <= 0) return "---";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="items-center">
      <div
        className="max-w-xs h-80 flex flex-col justify-between shadow-lg transition-transform transform hover:scale-105"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="cursor-default relative">
          <div
            className="relative h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${product.image})` }}
          >
            {/* Sale Badge */}
            {product.saleEndDateTime && (
              <div className="absolute bg-red-500 text-white py-1 px-2 text-xs font-bold rounded flex items-center gap-1">
                SALE{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.5 4.938a7 7 0 1 1-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 0 1 .572-2.759 6.026 6.026 0 0 1 2.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0 0 13.5 4.938ZM14 12a4 4 0 0 1-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 0 0 1.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 0 1 1.315-4.192.447.447 0 0 1 .431-.16A4.001 4.001 0 0 1 14 12Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            <div
              className={`absolute top-3 right-3 p-2 cursor-pointer transition-all duration-300 ease-in-out ${
                hovered || liked
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              } ${liked ? "text-red-500" : "text-black"} hover:opacity-70`}
              onClick={handleLikeClick}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 h-36 text-white p-2 transition-all duration-500 ease-in-out ${
                hovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="text-lg">{product.title}</div>
              <div className="text-sm">
                Giá gốc:{" "}
                {product.saleEndDateTime && timeLefts[product._id] > 0 ? (
                  <>
                    <span className="line-through text-white">
                      ${product.price.toLocaleString()}
                    </span>
                    <br />
                    <span className="text-red-600 font-bold bg-neutral-300">
                      Giá sale: $
                      {product.discountPercentage
                        ? (
                            product.price -
                            (product.price * product.discountPercentage) / 100
                          ).toLocaleString()
                        : product.price.toLocaleString()}{" "}
                    </span>
                    <br />
                    <span className="text-xs text-black bg-neutral-300">
                      Thời gian còn lại:{" "}
                      {formatTimeLeft(timeLefts[product._id])}
                    </span>
                  </>
                ) : (
                  <span>${product.price.toLocaleString()}</span>
                )}
              </div>
              <div className="text-sm">
                Đánh giá: {product.rating?.rate ?? "N/A"}/5
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-4 py-2 gap-3">
          <Link to={`/product/${product._id}`}>
            <button className="border border-pink-500 rounded text-black h-9 px-4 hover:bg-gray-200">
              Chi tiết
            </button>
          </Link>
          <button
            onClick={(event) => handleAddToCart(event, product)}
            className="bg-gradient-to-r from-pink-500 to-pink-500 bg-size-200% rounded text-white h-9 px-4 hover:from-pink-700 hover:to-pink-700"
          >
            Thêm giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
