import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "src/component/loading/Loading";
import ProductForm from "src/component/ProductForm/ProductForm";
import { useStatus } from "src/contexts/Status";
import { Product, ProductFormParams } from "src/types/products";

function AdminProductEdit() {
  const nav = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const { setLoading } = useStatus();

  useEffect(() => {
    if (!id) {
      toast.error("ID sản phẩm không hợp lệ.");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Product>(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error((error as AxiosError)?.message || "Lỗi khi lấy sản phẩm.");
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, setLoading]);

  const token = localStorage.getItem("token");

  const onSubmit = async (formData: FormData) => {
  try {
    setLoading(true);
    await axios.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Cập nhật sản phẩm thành công!");
    setTimeout(() => {
      nav("/admin/product/list");
    }, 1000);
  } catch (error) {
    toast.error(
      (error as AxiosError)?.message || "Lỗi khi cập nhật sản phẩm."
    );
    console.error("Error updating product:", error);
  } finally {
    setLoading(false);
  }
};


  // Chuyển đổi dữ liệu từ Product sang ProductFormParams
  const initialValues: ProductFormParams = product
    ? {
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image || "", 
        description: product.description,
        category: product.category._id,
      }
    : {
        _id: "",
        title: "",
        price: 0,
        image: "",
        description: "",
        category: "",
      };

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="space-y-4">
          <Loading />
          <ProductForm
            onSubmit={onSubmit}
            initialValues={initialValues}
            isEdit
          />
        </div>
      </div>
    </>
  );
}

export default AdminProductEdit;
