import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiX,
  FiUpload,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import useAuth from "../../context/auth/AuthContext";
import { CgSpinner } from "react-icons/cg";
import { BiX } from "react-icons/bi";

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  numberOfProducts?: number;
  categorySales?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image: File | null;
  removeImage: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  image?: string;
  submit?: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export const getAllCategories = async (): Promise<Category[] | null> => {
  try {
    const response = await fetch(`${BASE_URL}/category`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch categories: ${response.statusText}`
      );
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.log((error as Error).message);
    return null;
  }
};

const CategoryListTable: React.FC = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    image: null,
    removeImage: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: null,
      removeImage: false,
    });
    setImagePreview(category.image);
    setShowEditModal(true);
    setErrors({});
    setSuccessMessage(null);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
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

      setFormData((prev) => ({
        ...prev,
        image: file,
        removeImage: false,
      }));
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
    setFormData((prev) => ({
      ...prev,
      image: null,
      removeImage: true,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;

    setSuccessMessage(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setUpdatingId(editingCategory._id);

    try {
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());

      if (formData.removeImage) {
        formDataToSend.append("removeImage", "true");
      }

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(
        `${BASE_URL}/category/${editingCategory._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update category: ${response.statusText}`
        );
      }

      const result = await response.json();

      setCategories((prev) =>
        prev.map((cat) => (cat._id === editingCategory._id ? result.data : cat))
      );

      setSuccessMessage("Category updated successfully!");

      setTimeout(() => {
        setShowEditModal(false);
        setEditingCategory(null);
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setDeletingId(categoryToDelete._id);

    try {
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${BASE_URL}/category/${categoryToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete category: ${response.statusText}`
        );
      }

      setCategories((prev) =>
        prev.filter((cat) => cat._id !== categoryToDelete._id)
      );

      setShowDeleteModal(false);
      setCategoryToDelete(null);
      setSuccessMessage("Category deleted successfully!");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const closeEditModal = () => {
    if (updatingId) return;
    setShowEditModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", image: null, removeImage: false });
    setImagePreview(null);
    setErrors({});
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeDeleteModal = () => {
    if (deletingId) return;
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleFetchAllCategories = async () => {
    setSuccessMessage(null);
    setErrors({});

    try {
      setPending(true);
      const categoriesList = await getAllCategories();

      if (categoriesList) {
        setCategories(categoriesList);
      }
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    handleFetchAllCategories();
  }, []);

  return (
    <>
      {successMessage && !showEditModal && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">
              {successMessage}
            </p>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-600 hover:text-green-800"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {pending ? (
        <div className="bg-white w-full px-4 py-8 border border-zinc-50 rounded-md shadow-md h-[500px] flex items-center justify-center mx-auto">
          <CgSpinner className="animate-spin" size={30} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  All Categories
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {categories.length} of {categories.length} categories
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img
                            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                            src={category.image}
                            alt={category.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        <span>{category.categorySales?.toLocaleString()}</span>{" "}
                        <span>USD</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category.numberOfProducts || 0} products
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(category)}
                        disabled={
                          deletingId === category._id ||
                          updatingId === category._id
                        }
                        className="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Edit category"
                      >
                        <FiEdit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        disabled={
                          deletingId === category._id ||
                          updatingId === category._id
                        }
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Delete category"
                      >
                        <FiTrash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories found</p>
            </div>
          )}
        </div>
      )}

      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Category
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update category information
                </p>
              </div>
              <button
                onClick={closeEditModal}
                disabled={!!updatingId}
                className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {successMessage && (
              <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    {successMessage}
                  </p>
                </div>
              </div>
            )}

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
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!!updatingId}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., Electronics, Clothing, Food"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!!updatingId}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Describe this category..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* FIXED: Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>

                {imagePreview ? (
                  <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    {!updatingId && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={pending}
                        className="absolute top-2 right-2 p-1 bg-red-500  text-white rounded-full hover:bg-red-800 cursor-pointer duration-300 shadow-md transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <BiX color="white" className="w-5 h-5 text-gray-700" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={!!updatingId}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label
                      htmlFor="edit-image-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        errors.image
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      } ${updatingId ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload {formData.removeImage ? "new" : "image"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </span>
                    </label>
                  </div>
                )}

                {errors.image && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.image}
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={!!updatingId}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate} // FIXED: Remove parameter
                disabled={!!updatingId}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-w-[120px]"
              >
                {updatingId ? (
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
                    Updating...
                  </span>
                ) : (
                  "Update Category"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FiAlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Category
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">"{categoryToDelete.name}"</span>
                ?
                {categoryToDelete.numberOfProducts &&
                  categoryToDelete.numberOfProducts > 0 && (
                    <span className="text-red-600">
                      {" "}
                      This category contains {
                        categoryToDelete.numberOfProducts
                      }{" "}
                      product(s).
                    </span>
                  )}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={!!deletingId}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-w-[100px]"
                >
                  {deletingId ? (
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
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryListTable;
