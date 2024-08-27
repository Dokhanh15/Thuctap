import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CategoryForm from "src/component/ProductForm/CategoryForm";
import { Category } from "src/types/products";

function AdminCategoryAdd() {
  const nav = useNavigate();

  const onSubmit = async (values: Category) => {
    try {
      await axios.post("/categories", values);
      toast.success('Thành công!')
      setTimeout(() => {
        nav("/admin/category/list");
      }, 1000);
    } catch (error) {
      toast.error((error as AxiosError)?.message)
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-4">
        <CategoryForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default AdminCategoryAdd;
