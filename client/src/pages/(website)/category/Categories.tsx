import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useStatus } from "src/contexts/Status";
import { Category } from "src/types/products";

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { setLoading: setGlobalLoading } = useStatus();

  useEffect(() => {
    const fetchCategories = async () => {
      setGlobalLoading(true);
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (err) {
        toast.error((err as AxiosError)?.message || "Lỗi khi tải danh mục");
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    };

    fetchCategories();
  }, [setGlobalLoading]);

  if (loading)
    return (
      <p className="text-center text-lg text-gray-600">Đang tải danh mục...</p>
    );

  return (
    <>
      <div>
        <h3 className="text-x px-20  text-gray-800">DANH MỤC</h3>
        <div className="grid grid-cols-10 gap-2 px-20 justify-center mb-10">
          {categories.slice(0, 10).map((category) => (
            <div
              key={category._id}
              className="flex flex-col items-center p-2 bg-white shadow-sm rounded-md transition-transform transform hover:scale-105"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-19 h-19 object-cover rounded-full mb-1 border border-gray-200"
              />
              <h2 className="text-center text-xs font-medium text-gray-900">
                {category.name}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryList;
