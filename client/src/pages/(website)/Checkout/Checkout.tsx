import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "src/contexts/Card";

const Checkout = () => {
  const { cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handlePaymentMethodChange = (event: any) => {
    setPaymentMethod(event.target.value);
  };

  const handleVoucherApply = () => {
    // Logic để kiểm tra mã voucher và tính toán discount
    if (voucherCode === "DISCOUNT10") {
      setDiscount(10); // Giảm giá 10%
    } else {
      setDiscount(0); // Không có mã hợp lệ
    }
  };

  if (!cart || !cart.products) {
    return <div>Giỏ hàng của bạn trống.</div>;
  }

  // Tính tổng tiền giỏ hàng
  const totalCartAmount =
    cart.products.reduce((total, item) => {
      const hasSale =
        item.product.saleEndDateTime &&
        new Date(item.product.saleEndDateTime) > new Date();
      const salePrice = hasSale
        ? item.product.price *
          (1 - (item.product.discountPercentage || 0) / 100)
        : item.product.price;
      return total + salePrice * item.quantity;
    }, 0) || 0;

  const totalAfterDiscount = totalCartAmount - (totalCartAmount * discount) / 100;

  return (
    <div className="container mx-auto py-8">
      <div className="flex space-x-12">
        {/* Danh sách sản phẩm */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Giỏ hàng của bạn
          </h2>

          <div className="space-y-6">
            {cart.products.map((item, index) => {
              const hasSale =
                item.product.saleEndDateTime &&
                new Date(item.product.saleEndDateTime) > new Date();
              const salePrice = hasSale
                ? item.product.price *
                  (1 - (item.product.discountPercentage || 0) / 100)
                : item.product.price;

              return (
                <div key={index} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <p className="text-gray-700">{item.product.title}</p>
                  </div>
                  <div className="text-right">
                    {hasSale ? (
                      <div>
                        <span className="text-red-500 line-through mr-2">
                          ${item.product.price.toFixed(2)}
                        </span>
                        <span className="text-green-600">
                          ${salePrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span>${item.product.price.toFixed(2)}</span>
                    )}
                  </div>
                  <p className="text-gray-700">{item.quantity} x</p>
                  <p className="text-gray-700 font-semibold">
                    ${(item.quantity * salePrice).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phương thức thanh toán + Voucher */}
        <div className="w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Nhập mã giảm giá
          </h3>
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Nhập mã voucher"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleVoucherApply}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white w-full py-3 rounded-lg mt-4 hover:bg-purple-500 transition"
          >
            Áp dụng
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Chỉ một mã voucher có thể được áp dụng.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800">
            Phương thức thanh toán
          </h3>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={handlePaymentMethodChange}
                className="form-radio h-5 w-5 text-green-500"
              />
              <span className="ml-2 text-gray-700">
                Thanh toán khi nhận hàng
              </span>
            </label>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="payment"
                value="vnpay"
                checked={paymentMethod === "vnpay"}
                onChange={handlePaymentMethodChange}
                className="form-radio h-5 w-5 text-green-500"
              />
              <span className="ml-2 text-gray-700">Thanh toán qua VNPay</span>
            </label>
          </div>

          {/* Tổng tiền */}
          <div className="mt-6">
            <p className="font-bold text-lg text-gray-800">
              Tổng tiền sau giảm giá: ${totalAfterDiscount.toFixed(2)}
            </p>
          </div>

          <div className="mt-6">
            <Link to="/order-summary">
              <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-green-400 hover:to-teal-400 transition">
                Xác nhận thanh toán
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
