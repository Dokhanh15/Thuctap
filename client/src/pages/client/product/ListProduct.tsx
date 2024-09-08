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

  // Logic for adding product to cart
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

  return (
    <div className="items-center">
      <div
        className="max-w-xs h-80 flex flex-col justify-between shadow-lg transition-transform transform hover:scale-105"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="cursor-default">
          <div
            className="relative h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${product.image})` }}
          >
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
              <div className="text-sm">Giá: {product.price} $</div>
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
