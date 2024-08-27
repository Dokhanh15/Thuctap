import { useState, useEffect } from "react";
import axios from "axios";
import { useStatus } from "src/contexts/Status";
import { Category } from "src/types/products";
import { toast } from "react-toastify";

const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { setLoading } = useStatus();
  const [error, setError] = useState<string | null>(null);

  // Hàm để lấy danh sách các category
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/categories");
      setCategories(response.data);
    } catch (err) {
      setError("Không thể lấy danh sách category");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  // Thêm một category mới
  const addCategory = async (newCategory: Omit<Category, "_id">) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<Category>("/categories", newCategory);
      setCategories([...categories, response.data]);
      toast.success("Thêm danh mục thành công!");
    } catch (err) {
      setError("Không thể thêm category");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật một category hiện có
  const updateCategory = async (
    id: string,
    updatedCategory: Partial<Category>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<Category>(
        `/categories/${id}`,
        updatedCategory
      );
      toast.success("Cập nhật danh mục thành công!");
      setCategories(
        categories.map((category) =>
          category._id === id ? response.data : category
        )
      );
    } catch (err) {
      setError("Không thể cập nhật category");
    } finally {
      setLoading(false);
    }
  };

  // Xóa một category
  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      toast.success("Xóa danh mục thành công!");
    } catch (err) {
      setError("Không thể xóa category");
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories, 
  };
};

export default useCategory;
