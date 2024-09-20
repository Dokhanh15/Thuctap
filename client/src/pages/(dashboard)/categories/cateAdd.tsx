import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "src/component/loading/Loading";
import CategoryForm from "src/component/ProductForm/CategoryForm";
import { useStatus } from "src/contexts/Status";

function AdminCategoryAdd() {
  const nav = useNavigate();
  const { setLoading } = useStatus();

  const token = localStorage.getItem("token");
  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      await axios.post("/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Thành công!');
      setTimeout(() => {
        nav("/admin/category/list");
      }, 1000);
    } catch (error) {
      toast.error((error as AxiosError).message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-4">
        <Loading />
        <CategoryForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default AdminCategoryAdd;
