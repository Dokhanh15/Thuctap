import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import axios from "axios";
import { Category } from "src/types/products";

type CategoryFormProps = {
  onSubmit: (values: Category) => void;
  initialValues?: Category;
  isEdit?: boolean;
};

function CategoryForm({ onSubmit, initialValues, isEdit }: CategoryFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialValues && initialValues._id) {
      setSelectedCategoryId(initialValues._id);
    }
  }, [initialValues]);

  const validate = (values: Category) => {
    const { name, image, description } = values;
    const errors: { [key: string]: string } = {};
    if (!name) errors.name = "Vui lòng nhập tên danh mục";
    if (!image) errors.image = "Vui lòng nhập đường dẫn hình ảnh";
    if (!description) errors.description = "Vui lòng nhập mô tả";

    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialValues || { name: "", image: "", description: "" }}
      render={({ handleSubmit, submitting }) => (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-300"
        >
          <h2 className="text-4xl font-bold text-center mb-8">
            {isEdit ? "Cập nhật danh mục" : "Thêm danh mục mới"}
          </h2>
          <div className="space-y-6">
            <Field name="name">
              {({ input, meta }) => (
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Tên danh mục
                  </label>
                  <input
                    {...input}
                    type="text"
                    className={`mt-2 block w-full px-5 py-3 border rounded-lg shadow-md ${
                      meta.touched && meta.error
                        ? "border-red-600"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Nhập tên danh mục"
                  />
                  {meta.touched && meta.error && (
                    <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                  )}
                </div>
              )}
            </Field>

            <Field name="image">
              {({ input, meta }) => (
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Hình ảnh
                  </label>
                  <input
                    {...input}
                    type="text"
                    className={`mt-2 block w-full px-5 py-3 border rounded-lg shadow-md ${
                      meta.touched && meta.error
                        ? "border-red-600"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Nhập đường dẫn hình ảnh"
                  />
                  {meta.touched && meta.error && (
                    <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                  )}
                </div>
              )}
            </Field>

            <Field name="description">
              {({ input }) => (
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    {...input}
                    className="mt-2 block w-full px-5 py-3 border rounded-lg shadow-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả"
                  />
                </div>
              )}
            </Field>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-500"
              disabled={submitting}
            >
              {isEdit ? "Cập nhật danh mục" : "Thêm danh mục"}
            </button>
          </div>
        </form>
      )}
    />
  );
}

export default CategoryForm;
