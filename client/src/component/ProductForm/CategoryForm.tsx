import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { Category } from "src/types/products";

type CategoryFormProps = {
  onSubmit: (formData: FormData) => void;
  initialValues?: Category;
  isEdit?: boolean;
};

function CategoryForm({ onSubmit, initialValues, isEdit }: CategoryFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (initialValues && initialValues.image) {
      setImagePreview(initialValues.image);
    }
  }, [initialValues]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string | ArrayBuffer | null);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const validate = (values: Category) => {
    const errors: { [key: string]: string } = {};
    if (!values.name) errors.name = "Vui lòng nhập tên danh mục";
    return errors;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (values: Category) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description || '');

    if (file) {
      formData.append("image", file);
    } else if (imagePreview && typeof imagePreview === 'string') {
      formData.append("existingImage", imagePreview);
    }

    await onSubmit(formData);
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
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
            {/* Name Field */}
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
                      meta.touched && meta.error ? "border-red-600" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Nhập tên danh mục"
                  />
                  {meta.touched && meta.error && (
                    <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                  )}
                </div>
              )}
            </Field>

            {/* Image Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Hình ảnh
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-2 block w-full px-5 py-3 border rounded-lg shadow-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview as string}
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
