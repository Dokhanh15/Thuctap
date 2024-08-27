import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import axios from "axios";
import { Category, ProductFormParams } from "src/types/products";

type ProductFormProps = {
  onSubmit: (values: ProductFormParams) => void;
  initialValues?: ProductFormParams;
  isEdit?: boolean;
};

function ProductForm({ onSubmit, initialValues, isEdit }: ProductFormProps) {
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
    if (initialValues && initialValues.category) {
      setSelectedCategoryId(initialValues.category._id);
    }
  }, [initialValues]);

  const validate = (values: ProductFormParams) => {
    const { title, image, category, price } = values;
    const errors: { [key: string]: string } = {};
    if (!title) errors.title = "Vui lòng nhập tiêu đề";
    if (!image) errors.image = "Vui lòng nhập đường dẫn hình ảnh";
    if (!category) errors.category = "Vui lòng chọn danh mục";
    if (!price) errors.price = "Vui lòng nhập giá sản phẩm";

    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialValues || { isShow: true }}
      render={({ handleSubmit, submitting }) => (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-300"
        >
          <h2 className="text-4xl font-bold text-center mb-8">
            {isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <div className="space-y-6">
            <Field name="title">
              {({ input, meta }) => (
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Tiêu đề
                  </label>
                  <input
                    {...input}
                    type="text"
                    className={`mt-2 block w-full px-5 py-3 border rounded-lg shadow-md ${
                      meta.touched && meta.error
                        ? "border-red-600"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Nhập tiêu đề"
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

            <Field name="price">
              {({ input, meta }) => (
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Giá
                  </label>
                  <input
                    {...input}
                    type="number"
                    className={`mt-2 block w-full px-5 py-3 border rounded-lg shadow-md ${
                      meta.touched && meta.error
                        ? "border-red-600"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Nhập giá"
                  />
                  {meta.touched && meta.error && (
                    <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                  )}
                </div>
              )}
            </Field>

            <Field name="isShow" type="checkbox">
              {({ input }) => (
                <div className="flex items-center">
                  <input
                    {...input}
                    type="checkbox"
                    className="mr-3 h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-lg font-medium text-gray-700">
                    Hiển thị sản phẩm
                  </label>
                </div>
              )}
            </Field>

            <Field name="category">
              {({ input, meta }) => (
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Danh mục
                  </label>
                  <select
                    {...input}
                    className={`mt-2 block w-full px-5 py-3 border rounded-lg shadow-md ${
                      meta.touched && meta.error
                        ? "border-red-600"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={selectedCategoryId || ""}
                    onChange={(e) => {
                      input.onChange(e);
                      setSelectedCategoryId(e.target.value);
                    }}
                  >
                    <option value="">Chọn</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {meta.touched && meta.error && (
                    <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                  )}
                </div>
              )}
            </Field>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-500"
              disabled={submitting}
            >
              {isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </button>
          </div>
        </form>
      )}
    />
  );
}

export default ProductForm;
