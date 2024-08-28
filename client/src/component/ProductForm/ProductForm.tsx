import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import axios from "axios";
import { Category, ProductFormParams } from "src/types/products";

type ProductFormProps = {
  onSubmit: (formData: FormData) => void;
  initialValues?: ProductFormParams;
  isEdit?: boolean;
};

function ProductForm({ onSubmit, initialValues, isEdit }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/categories");
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialValues) {
      if (initialValues.image && typeof initialValues.image === 'string') {
        if (!file) { // Chỉ cập nhật `imagePreview` khi không có file mới
          setImagePreview(initialValues.image);
        }
      }
    }
  }, [initialValues]);
  

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string | ArrayBuffer | null);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [file]);

  const validate = (values: ProductFormParams) => {
    const errors: { [key: string]: string } = {};
    if (!values.title) errors.title = "Vui lòng nhập tiêu đề";
    if (!values.category) errors.category = "Vui lòng chọn danh mục";
    if (!values.image) errors.image = "Vui lòng nhập ảnh sản phẩm";
    if (!values.price) errors.price = "Vui lòng nhập giá sản phẩm";
    return errors;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setFile(newFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string | ArrayBuffer | null);
      };
      reader.readAsDataURL(newFile);
    }
  };
  

  const handleFormSubmit = async (values: ProductFormParams) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description || '');
    formData.append("price", String(values.price));
    formData.append("category", values.category);
  
    if (file) {
      formData.append("image", file);
    } else if (typeof imagePreview === 'string') {
      // Đảm bảo rằng hình ảnh hiện tại được giữ lại nếu không có file mới
      formData.append("existingImage", imagePreview);
    }
  
    await onSubmit(formData); 
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
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
            {/* Title Field */}
            <Field name="title">
              {({ input, meta }) => (
                <div>
                  <label className="block text-lg font-medium text-gray-700">Tiêu đề</label>
                  <input
                    {...input}
                    type="text"
                    className={`mt-2 block w-full px-5 py-3 border rounded-lg shadow-md ${
                      meta.touched && meta.error ? "border-red-600" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Nhập tiêu đề"
                  />
                  {meta.touched && meta.error && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
                </div>
              )}
            </Field>

            {/* Image Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">Hình ảnh</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-2 block w-full px-5 py-3 border rounded-lg shadow-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && typeof imagePreview === "string" && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-64 h-auto border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Description Field */}
            <Field name="description">
              {({ input }) => (
                <div>
                  <label className="block text-lg font-medium text-gray-700">Mô tả</label>
                  <textarea
                    {...input}
                    className="mt-2 block w-full px-5 py-3 border rounded-lg shadow-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả"
                  />
                </div>
              )}
            </Field>

            {/* Price Field */}
            <Field name="price">
              {({ input, meta }) => (
                <div>
                  <label className="block text-lg font-medium text-gray-700">Giá</label>
                  <input
                    {...input}
                    type="number"
                    className={`mt-2 block w-full px-5 py-3 border rounded-lg shadow-md ${
                      meta.touched && meta.error ? "border-red-600" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Nhập giá sản phẩm"
                  />
                  {meta.touched && meta.error && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
                </div>
              )}
            </Field>

            {/* Category Field */}
            <Field name="category">
              {({ input, meta }) => (
                <div>
                  <label className="block text-lg font-medium text-gray-700">Danh mục</label>
                  <select
                    {...input}
                    className={`mt-2 block w-full px-5 py-3 border rounded-lg shadow-md ${
                      meta.touched && meta.error ? "border-red-600" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {meta.touched && meta.error && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
                </div>
              )}
            </Field>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {submitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
              </button>
            </div>
          </div>
        </form>
      )}
    />
  );
}

export default ProductForm;
