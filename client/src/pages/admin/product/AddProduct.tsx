import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProductForm from "src/component/ProductForm/ProductForm";
import { ProductFormParams } from "src/types/products";

function AdminProductAdd() {
  const nav = useNavigate();

  const onSubmit = async (values: ProductFormParams) => {
    try {
      await axios.post("/products", values);
      toast.success('Thành công!')
      setTimeout(() => {
        nav("/admin/product/list");
      }, 1000);
    } catch (error) {
      toast.error((error as AxiosError)?.message)
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-4">
        <ProductForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default AdminProductAdd;
