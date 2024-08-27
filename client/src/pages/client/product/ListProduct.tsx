import { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "src/contexts/user";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Product } from "src/types/products";
import axiosInstance from "src/config/configAxios";

type ProductCardProps = {
  product: Product;
};

const ListProduct: FC<ProductCardProps> = ({ product }) => {
  const [hovered, setHovered] = useState(false);
//   const { addToCart } = useProductCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [quantity] = useState<number>(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [liked, setLiked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  

  useEffect(() => {
    const checkLikedStatus = async () => {
      const token = localStorage.getItem("Token");
      if (token) {
        try {
          const response = await axiosInstance.get("/users/liked-products");
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
    try {
      if (liked) {
        await axiosInstance.post(`/users/unlike/${product._id}`);
        setSnackbar({
          open: true,
          message: "Đã bỏ thích sản phẩm",
          severity: "success",
        });
        window.location.reload();
      } else {
        await axiosInstance.post(`/users/like/${product._id}`);
        setSnackbar({
          open: true,
          message: "Đã thích sản phẩm",
          severity: "success",
        });
      }
      setLiked(!liked);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra",
        severity: "error",
      });
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
    // addToCart({ product, quantity });
    setSnackbar({
      open: true,
      message: "Thêm vào giỏ hàng thành công!",
      severity: "success",
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          selectedCategoryId ? `/products?category=${selectedCategoryId}` : "/products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="max-w-xs h-80 flex flex-col justify-between shadow-lg transition-transform transform hover:scale-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link to={``} className="cursor-default">
          <div
            className="relative h-64 bg-cover bg-center "
            style={{ backgroundImage: `url(${product.image})` }}
          >
            <div
              className={`absolute top-3 right-3 p-2 cursor-pointer ${
                liked ? "text-red-500" : "text-black"
              } hover:opacity-70`}
              onClick={handleLikeClick}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 h-36 text-white p-2 transition-opacity ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="text-lg">{product.title}</div>
              <div className="text-sm">Giá: {product.price} $</div>
              <div className="text-sm">
                Đánh giá: {product.rating?.rate ?? "N/A"}/5
              </div>
            </div>
          </div>
        </Link>
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
