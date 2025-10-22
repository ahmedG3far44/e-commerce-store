import React, { useState, useRef, ChangeEvent } from "react";

import { BiCheck, BiUpload, BiX } from "react-icons/bi";
import { FiAlertCircle } from "react-icons/fi";
import { IoAlertCircle } from "react-icons/io5";
import { useCategory } from "../../context/category/CategoryContext";

import CategoryListTable from "./CategoryListTable";
import useAuth from "../../context/auth/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

interface CategoryFormData {
  name: string;
  description: string;
  image: File | null;
}

interface FormErrors {
  name?: string;
  description?: string;
  image?: string;
  submit?: string;
}

const AdminCategory: React.FC = () => {
  const { token } = useAuth();
  const { getAllCategories } = useCategory();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.image) {
      newErrors.image = "Category image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

   
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (successMessage) {
      setSuccessMessage(null);
    }
  };

 
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload a valid image file",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: undefined }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleSubmit = async () => {
    setSuccessMessage(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(`${BASE_URL}/category`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to create category: ${response.statusText}`
        );
      }

      const result = await response.json();

      setSuccessMessage("Category created successfully!");
      setFormData({
        name: "",
        description: "",
        image: null,
      });
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      getAllCategories();
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", image: null });
    setImagePreview(null);
    setErrors({});
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-7xl h-screen mx-auto flex flex-col gap-10 min-h-screen  py-8 px-4">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              Add Category
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Create a new product category
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <BiCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">
                  {successMessage}
                </p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 hover:text-green-800"
              >
                <BiX className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">
                  {errors.submit}
                </p>
              </div>
              <button
                onClick={() =>
                  setErrors((prev) => ({ ...prev, submit: undefined }))
                }
                className="text-red-600 hover:text-red-800"
              >
                <BiX className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Category Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="e.g., Electronics, Clothing, Food"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <IoAlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Describe this category and what products it contains..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <IoAlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image
              </label>

              {!imagePreview ? (
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      errors.image
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <BiUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload image
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative w-40 h-40 border-2  border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                    className="absolute top-2 right-2 p-1 bg-red-500  text-white rounded-full hover:bg-red-800 cursor-pointer duration-300 shadow-md transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <BiX color="white" className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              )}

              {errors.image && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <IoAlertCircle className="w-4 h-4" />
                  {errors.image}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-w-[120px]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <CategoryListTable />
    </div>
  );
};

export default AdminCategory;
