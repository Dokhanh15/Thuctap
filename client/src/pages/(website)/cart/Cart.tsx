import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "src/component/loading/Loading";
import { useCart } from "src/contexts/Card";
import { useStatus } from "src/contexts/Status";
import { useProductCart } from "src/Hooks/CartProducts";
import { CartItemProps } from "src/types/cart";

const labels = ["Sản phẩm", "Giá", "Số lượng", "Tổng tiền", ""];

const Cart = () => {
  const { cart, updateCartQuantity } = useCart();
  const { getCartUser, removeToCart } = useProductCart();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { setLoading } = useStatus();
  const [productIdToRemove, setProductIdToRemove] = useState<string | null>(
    null
  );

  useEffect(() => {
    getCartUser();
  }, [getCartUser]);

  const calculateSubtotal = (price: number, quantity: number) =>
    price * quantity;

  const handleRemoveFromCart = async () => {
    if (productIdToRemove) {
      try {
        setLoading(true);
        await removeToCart(productIdToRemove);
        await getCartUser();
        toast.success("Sản phẩm đã được xóa khỏi giỏ hàng");
      } catch (error) {
        console.error("Failed to remove item from cart", error);
        toast.error("Không thể xóa sản phẩm khỏi giỏ hàng");
      } finally {
        setLoading(false);
        setProductIdToRemove(null);
        setConfirmOpen(false);
      }
    }
  };

  const handleRemoveClick = (productId: string) => {
    setProductIdToRemove(productId);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setProductIdToRemove(null);
  };

  const handleIncreaseQuantity = async (productId: string) => {
    await updateCartQuantity(productId, "increase");
    await getCartUser();
  };

  const handleDecreaseQuantity = async (
    productId: string,
    currentQuantity: number
  ) => {
    if (currentQuantity <= 1) {
      setProductIdToRemove(productId);
      setConfirmOpen(true);
    } else {
      await updateCartQuantity(productId, "decrease");
      await getCartUser();
    }
  };

  // Tính tổng tiền của giỏ hàng
  const totalCartAmount =
    cart?.products?.reduce((total, item) => {
      const hasSale =
        item.product.saleEndDateTime &&
        new Date(item.product.saleEndDateTime) > new Date();
      const salePrice = hasSale
        ? item.product.price *
          (1 - (item.product.discountPercentage || 0) / 100)
        : item.product.price;
      return total + calculateSubtotal(salePrice, item.quantity);
    }, 0) || 0;

  return (
    <div className="container mx-auto py-8">
      <div className="flex space-x-12">
        {/* Left - Cart Items */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Giỏ hàng của bạn
          </h2>

          <div className="p-3 flex justify-evenly items-center shadow bg-gray-100 border-gray-300 py-2 mb-6">
            {labels.map((label, index) => (
              <p key={index} className="font-semibold text-gray-700">
                {label}
              </p>
            ))}
          </div>

          <Loading />
          {cart && cart.products && cart.products.length > 0 ? (
            <div className="space-y-6">
              {cart.products.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  onDecrease={() =>
                    handleDecreaseQuantity(item.product._id, item.quantity)
                  }
                  onIncrease={() => handleIncreaseQuantity(item.product._id)}
                  onRemove={() => handleRemoveClick(item.product._id)}
                  calculateSubtotal={calculateSubtotal}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">Giỏ hàng trống</p>
          )}

          {/* Hiển thị tổng tiền */}
          {cart && cart.products && cart.products.length > 0 && (
            <div className="mt-6 flex justify-start">
              <p className="font-bold text-lg text-gray-800">
                Tổng tiền: ${totalCartAmount.toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Link to="/checkout">
              <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-green-400 hover:to-teal-400 transition">
                Thanh toán
              </button>
            </Link>
          </div>
        </div>

        {/* Right - Voucher Display */}
        <div className="w-full lg:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">
            Các Voucher Có Sẵn
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              <span className="text-gray-700 font-medium">
                Giảm giá 20% cho đơn hàng từ $50
              </span>
              <button className="bg-emerald-500 text-white py-1 px-3 rounded-lg hover:bg-emerald-400 transition">
                Lưu
              </button>
            </div>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              <span className="text-gray-700 font-medium">
                Giảm giá $10 cho đơn hàng tiếp theo
              </span>
              <button className="bg-emerald-500 text-white py-1 px-3 rounded-lg hover:bg-emerald-400 transition">
                Lưu
              </button>
            </div>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              <span className="text-gray-700 font-medium">
                Giao hàng miễn phí cho đơn hàng từ $30
              </span>
              <button className="bg-emerald-500 text-white py-1 px-3 rounded-lg hover:bg-emerald-400 transition">
                Lưu
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">
            * Chỉ một mã voucher có thể được áp dụng cho mỗi đơn hàng.
          </p>
        </div>
      </div>

      {/* Confirm Dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-center">
              Xác nhận xóa sản phẩm
            </h3>
            <p className="text-center mt-4">
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
            </p>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={handleConfirmClose}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleRemoveFromCart}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CartItem = ({
  item,
  onDecrease,
  onIncrease,
  onRemove,
  calculateSubtotal,
}: CartItemProps) => {
  const { product } = item;
  const hasSale =
    product.saleEndDateTime && new Date(product.saleEndDateTime) > new Date();
  const salePrice = hasSale
    ? product.price * (1 - (product.discountPercentage || 0) / 100)
    : product.price;

  return (
    <div className="relative grid grid-cols-6 items-center p-4 border border-gray-300 rounded-lg shadow-sm gap-4">
      {/* Sale Badge */}
      {hasSale && (
        <div className="absolute top-2 left-2 bg-red-500 text-white py-1 px-2 text-xs font-bold rounded flex items-center gap-1">
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

      {/* Cột 1: Hình ảnh và tên sản phẩm */}
      <div className="col-span-2 flex items-center space-x-4 mt-5">
        <img
          src={product.image}
          alt={product.title || "Product Image"}
          className="w-24 h-24 object-cover"
        />
        <p className="font-medium text-gray-800 truncate max-w-xs">
          {product.title || "No Title"}
        </p>
      </div>

      {/* Cột 2: Giá sản phẩm */}
      <p className="col-span-1 font-medium text-gray-800 text-center shadow bg-gray-100">
        {hasSale ? (
          <>
            <span className="line-through text-red-500">${product.price}</span>
            <span className="ml-2 text-green-600">${salePrice.toFixed(2)}</span>
          </>
        ) : (
          `Giá: $${product.price}`
        )}
      </p>

      {/* Cột 3: Số lượng */}
      <div className="col-span-1 flex justify-center items-center space-x-2">
        <button
          onClick={onDecrease}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
        >
          -
        </button>
        <p className="font-medium">{item.quantity}</p>
        <button
          onClick={onIncrease}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
        >
          +
        </button>
      </div>

      {/* Cột 4: Tổng tiền */}
      <p className="col-span-1 font-medium text-gray-800 text-center shadow bg-gray-100">
        Tổng: ${calculateSubtotal(salePrice, item.quantity).toFixed(2)}
      </p>

      {/* Cột 5: Nút xóa */}
      <button
        onClick={onRemove}
        className="col-span-1  text-red-600  border rounded px-4 py-2 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Xóa
      </button>
    </div>
  );
};

export default Cart;
