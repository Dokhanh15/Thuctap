import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductForm from "src/component/ProductForm/ProductForm";
import { useStatus } from "src/contexts/Status";
import { Product, ProductFormParams } from "src/types/products";

function AdminProductEdit() {
  const nav = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const { setLoading } = useStatus();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Product>(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error((error as AxiosError)?.message);
        console.log("Error fetching product", error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const onSubmit = async (values: ProductFormParams) => {
    try {
      setLoading(true);
      await axios.put(`/products/${id}`, values);
      toast.success("Thành công!");
      setTimeout(() => {
        nav("/admin/product/list");
      }, 1000);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="space-y-4">
          <ProductForm
            onSubmit={onSubmit}
            initialValues={product as unknown as ProductFormParams}
            isEdit
          />
        </div>
      </div>
    </>
  );
}

export default AdminProductEdit;
