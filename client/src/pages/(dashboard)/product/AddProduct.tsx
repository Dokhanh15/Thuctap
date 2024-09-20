import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProductForm from "src/component/ProductForm/ProductForm";
import { useStatus } from "src/contexts/Status";

function AdminProductAdd() {
  const navigate = useNavigate();
  const { setLoading } = useStatus();
  const token = localStorage.getItem("token");

  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      await axios.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Thành công!");
      setTimeout(() => {
        navigate("/admin/product/list");
      }, 1000);
    } catch (error) {
      toast.error((error as AxiosError)?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
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
