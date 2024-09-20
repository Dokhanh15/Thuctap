import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "src/component/loading/Loading";
import CategoryForm from "src/component/ProductForm/CategoryForm";
import { useStatus } from "src/contexts/Status";
import { Category } from "src/types/products";

function AdminCategoryEdit() {
  const nav = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState<Category | undefined>();
  const { setLoading } = useStatus();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Category>(`/categories/${id}`);
        setCategory(data);
      } catch (error) {
        toast.error((error as AxiosError)?.message);
        console.log("Error fetching category", error);
      }
      setLoading(false);
    };

    fetchCategory();
  }, [id, setLoading]);

  const token = localStorage.getItem("token");
  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      await axios.put(`/categories/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Thành công!");
      setTimeout(() => {
        nav("/admin/category/list");
      }, 1000);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
      console.error("Error updating category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="space-y-4">
          <Loading />
          <CategoryForm onSubmit={onSubmit} initialValues={category} isEdit />
        </div>
      </div>
    </>
  );
}

export default AdminCategoryEdit;
