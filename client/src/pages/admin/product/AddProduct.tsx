import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "src/component/loading/Loading";
import ProductForm from "src/component/ProductForm/ProductForm";
import { useStatus } from "src/contexts/Status";

function AdminProductAdd() {
  const nav = useNavigate();
  const { setLoading } = useStatus();
  const token = localStorage.getItem("token");
  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      await axios.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
          ,
        Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Thành công!");
      setTimeout(() => {
        nav("/admin/product/list");
      }, 1000);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-4">
        <Loading />
        <ProductForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default AdminProductAdd;
