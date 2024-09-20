import { FC } from "react";
import { Product } from "src/types/products";
import ListProduct from "./ListProduct";

type SaleProductsProps = {
  productList: Product[];
};

const SaleProducts: FC<SaleProductsProps> = ({ productList }) => {
  // Lọc các sản phẩm đang giảm giá
  const saleProducts = productList.filter((product) => {
    const now = new Date().getTime();
    const saleEnd = new Date(product.saleEndDateTime || 0).getTime();
    return saleEnd > now;
  });

  return (
    <>
      <div className=" overflow-x-scroll whitespace-nowrap px-20 py-6">
        <h3 className="text-3xl text-center text-red-600 p-3 mb-5 flex items-center gap-3 border-b">
          SẢN PHẨM SALE{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-10"
          >
            <path
              fillRule="evenodd"
              d="M13.5 4.938a7 7 0 1 1-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 0 1 .572-2.759 6.026 6.026 0 0 1 2.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0 0 13.5 4.938ZM14 12a4 4 0 0 1-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 0 0 1.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 0 1 1.315-4.192.447.447 0 0 1 .431-.16A4.001 4.001 0 0 1 14 12Z"
              clipRule="evenodd"
            />
          </svg>{" "}
        </h3>
        <div className="inline-flex gap-4">
          {saleProducts.length === 0 ? (
            <div>Không có sản phẩm nào đang giảm giá.</div>
          ) : (
            saleProducts.map((product) => (
              <ListProduct key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SaleProducts;
