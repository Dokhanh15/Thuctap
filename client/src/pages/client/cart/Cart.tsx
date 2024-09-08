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

          <div className="flex justify-center mt-6">
            <Link to="/checkout">
              <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-green-400 hover:to-teal-400 transition">
                Thanh toán
              </button>
            </Link>
          </div>
        </div>

        {/* Right - Voucher Input */}
        <div className="w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Nhập mã giảm giá
          </h3>
          <input
            type="text"
            placeholder="Nhập mã voucher"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500"
          />
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white w-full py-3 rounded-lg mt-4 hover:bg-purple-500 transition">
            Áp dụng
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Chỉ một mã voucher có thể được áp dụng.
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
}: CartItemProps) => (
  <div className="grid grid-cols-6 items-center p-4 border border-gray-300 rounded-lg shadow-sm gap-4">
    {/* Cột 1: Hình ảnh và tên sản phẩm */}
    <div className="col-span-2 flex items-center space-x-4">
      <img
        src={item.product.image}
        alt={item.product.title || "Product Image"}
        className="w-24 h-24 object-cover"
      />
      <p className="font-medium text-gray-800 truncate max-w-xs">
        {item.product.title || "No Title"}
      </p>
    </div>

    {/* Cột 2: Giá sản phẩm */}
    <p className="col-span-1 font-medium text-gray-800 text-center shadow bg-gray-100 ">
      Giá: ${item.product.price}
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
      Tổng: ${calculateSubtotal(item.product.price, item.quantity)}
    </p>

    {/* Cột 5: Nút xóa */}
    <button
      onClick={onRemove}
      className="col-span-1 text-red-500 hover:text-red-700 text-center"
    >
      Xóa
    </button>
  </div>
);

export default Cart;
