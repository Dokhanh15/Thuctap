import { FC, useState, useEffect } from "react";
import { useUser } from "src/contexts/user";
import axiosInstance from "src/config/configAxios";
import { Product } from "src/types/products";
import ListProduct from "./ListProduct"; 
import { useStatus } from "src/contexts/Status";
import Loading from "src/component/loading/Loading";



const LikedProducts: FC = () => {
  const { user } = useUser();
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const { setLoading } = useStatus();


  useEffect(() => {
    const fetchLikedProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get("/userlike/liked-products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikedProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm đã thích:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLikedProducts();
    }
  }, [user]);

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-2xl font-semibold my-5">Sản phẩm đã thích</h1>
      <Loading />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {likedProducts.length === 0 ? (
          <div>Chưa có sản phẩm nào trong danh sách yêu thích của bạn.</div>
        ) : (
          likedProducts.map((product) => (
            <ListProduct key={product._id} product={product}  />
          ))
        )}
      </div>
    </div>
  );
};

export default LikedProducts;

