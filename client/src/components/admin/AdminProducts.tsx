import { handlePrice } from "../../utils/handlers";
import { useRef, useState, useEffect } from "react";
import { FiCheck, FiAlertCircle } from "react-icons/fi";
import { useCategory } from "../../context/category/CategoryContext";

import toast from "react-hot-toast";
import useAuth from "../../context/auth/AuthContext";

import UploadedImages from "./UploadedImages";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export interface CustomFile {
  lastModified: number;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

interface Product {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  totalSales: number;
  ordersCount: number;
  createdAt?: string;
}

function AdminProducts() {
  const { token } = useAuth();
  const { categories } = useCategory();
  const [files, setFiles] = useState<CustomFile[] | []>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] =
    useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<any>(null);
  const addProductFormRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const categoryRef = useRef<HTMLSelectElement | null>(null);
  const imagesRef = useRef<any>(null);
  const priceRef = useRef<any>("0");
  const stockRef = useRef<any>("0");
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    if (editingProduct) {
      if (titleRef.current) titleRef.current.value = editingProduct.title;
      if (descriptionRef.current)
        descriptionRef.current.value = editingProduct.description;
      if (categoryRef.current)
        categoryRef.current.value = editingProduct.categoryId;
      if (priceRef.current)
        priceRef.current.value = editingProduct.price.toString();
      if (stockRef.current)
        stockRef.current.value = editingProduct.stock.toString();
      const thumbnailIndex = editingProduct.images.findIndex(
        (img) => img === editingProduct.thumbnail
      );
      setSelectedThumbnailIndex(thumbnailIndex >= 0 ? thumbnailIndex : 0);
      addProductFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editingProduct]);
  const handleRemoveSelectedFile = (removedFile: File) => {
    const filterFiles = files.filter((file) => file !== removedFile);
    setFiles(filterFiles);
    if (
      selectedThumbnailIndex >= filterFiles.length &&
      filterFiles.length > 0
    ) {
      setSelectedThumbnailIndex(filterFiles.length - 1);
    }
  };
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch(`${BASE_URL}/product`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };
  const handelAddNewProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      setPending(true);
      setError(null);
      setUploadError(null);

      let imagesUpload: string[] = [];

      if (files.length > 0) {
        setIsUploading(true);
        const filesArray: File[] = Array.from(imagesRef?.current?.files || []);

        try {
          imagesUpload = await uploadImages(filesArray);

          if (!imagesUpload || imagesUpload.length <= 0) {
            throw new Error("Failed to upload images to server");
          }
        } catch (uploadErr: any) {
          setUploadError(uploadErr.message || "Image upload failed");
          throw uploadErr;
        } finally {
          setIsUploading(false);
        }
      } else if (editingProduct) {
        imagesUpload = editingProduct.images;
      } else {
        throw new Error("Please upload at least one image");
      }

      const thumbnailIdx = Math.min(
        selectedThumbnailIndex,
        imagesUpload.length - 1
      );

      const selectedCategoryId = categoryRef.current?.value as string;
      const categoryName = categories.find(
        (category) => category._id === selectedCategoryId
      )?.name as string;

      const product = {
        categoryId: selectedCategoryId,
        categoryName: categoryName,
        title: titleRef?.current?.value as string,
        description: descriptionRef?.current?.value as string,
        thumbnail: imagesUpload[thumbnailIdx],
        images: imagesUpload,
        price: parseFloat(priceRef?.current?.value),
        stock: parseInt(stockRef?.current?.value),
      };

      const url = editingProduct
        ? `${BASE_URL}/product/${editingProduct._id}`
        : `${BASE_URL}/product`;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${editingProduct ? "update" : "add"} product`
        );
      }

      const data = await response.json();

      if (!data)
        throw new Error(
          `Failed to get ${editingProduct ? "updated" : "new"} product`
        );

      if (addProductFormRef.current) {
        setError(null);
        setUploadError(null);
        addProductFormRef?.current?.reset();
        setFiles([]);
        setEditingProduct(null);
        setSelectedThumbnailIndex(0);
      }

      toast.success(
        `Product ${editingProduct ? "updated" : "added"} successfully!`
      );
      await fetchProducts();
    } catch (err: any) {
      console.error(err?.message);
      setError(err?.message);
      toast.error(err?.message);
    } finally {
      setPending(false);
      setIsUploading(false);
    }
  };
  const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
      const formData = new FormData();

      for (const file of files) {
        formData.append("image", file);
      }

      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload images");
      }

      const data = await response.json();

      if (!data || !data.images) {
        throw new Error("Invalid response from server");
      }

      return data.images;
    } catch (err: any) {
      console.error("Upload error:", err?.message);
      throw err;
    }
  };
  const deleteProduct = async (productId: string) => {
    try {
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`${BASE_URL}/product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully!");
      await fetchProducts();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete product");
    }
  };
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setError(null);
    setUploadError(null);
  };
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setError(null);
    setUploadError(null);
    setFiles([]);
    setSelectedThumbnailIndex(0);
    if (addProductFormRef.current) {
      addProductFormRef.current.reset();
    }
  };
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });
  const previewImages = files.map((file) => URL.createObjectURL(file as any));
  return (
    <div className="w-full min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              {editingProduct && (
                <button
                  onClick={handleCancelEdit}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <form
            ref={addProductFormRef}
            onSubmit={handelAddNewProduct}
            className="p-6"
          >
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center">
                  <FiAlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-200">
                <div className="flex items-center">
                  <FiAlertCircle className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0" />
                  <span className="text-orange-800 font-medium">
                    Upload Error: {uploadError}
                  </span>
                </div>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  ref={titleRef}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  type="text"
                  name="title"
                  placeholder="Short sleeve t-shirt"
                  required
                  disabled={pending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  ref={descriptionRef}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  name="description"
                  rows={4}
                  placeholder="Describe your product..."
                  required
                  disabled={pending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images{" "}
                  {editingProduct && (
                    <span className="text-gray-500 text-xs">
                      (Leave empty to keep existing images)
                    </span>
                  )}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <input
                    className="hidden"
                    name="image"
                    id="image"
                    type="file"
                    multiple
                    accept="image/*"
                    ref={imagesRef}
                    disabled={pending || isUploading}
                    onChange={(e) => {
                      if (e.target.files) {
                        setFiles(Array.from(e.target.files));
                        setSelectedThumbnailIndex(0);
                        setUploadError(null);
                      }
                    }}
                  />
                  <label
                    htmlFor="image"
                    className={`flex flex-col items-center justify-center ${
                      pending || isUploading
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="text-blue-600 font-medium">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB (multiple files supported)
                    </p>
                  </label>
                </div>
                {isUploading && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-blue-700 font-medium">
                        Uploading images to server...
                      </span>
                    </div>
                  </div>
                )}
                {files.length > 0 && !isUploading && (
                  <div className="mt-4">
                    <div className="mb-3">
                      <UploadedImages
                        uploadStatus={false}
                        removeFiles={handleRemoveSelectedFile}
                        uploaded={files as File[]}
                      />
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Select Thumbnail Image
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {previewImages.map((preview, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedThumbnailIndex(idx)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selectedThumbnailIndex === idx
                                ? "border-blue-500 ring-2 ring-blue-200"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {selectedThumbnailIndex === idx && (
                              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                <div className="bg-blue-500 rounded-full p-1">
                                  <FiCheck className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                              {idx + 1}
                            </div>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Selected: Image {selectedThumbnailIndex + 1} (will be
                        used as main product image)
                      </p>
                    </div>
                  </div>
                )}

                {/* Current Images for Editing */}
                {editingProduct && files.length === 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Current Images
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {editingProduct.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedThumbnailIndex(idx)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedThumbnailIndex === idx
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Product ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {selectedThumbnailIndex === idx && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                              <div className="bg-blue-500 rounded-full p-1">
                                <FiCheck className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                          {img === editingProduct.thumbnail && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                              Current
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                            {idx + 1}
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Click to select a different thumbnail (currently: Image{" "}
                      {selectedThumbnailIndex + 1})
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    ref={categoryRef}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    name="category"
                    required
                    disabled={pending}
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (EGP)
                  </label>
                  <input
                    ref={priceRef}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    type="number"
                    name="price"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    disabled={pending}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    ref={stockRef}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    type="number"
                    name="stock"
                    placeholder="0"
                    min="0"
                    required
                    disabled={pending}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end gap-3">
              {editingProduct && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  disabled={pending || isUploading}
                >
                  Cancel
                </button>
              )}
              <button
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                type="submit"
                disabled={pending || isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Uploading Images...
                  </span>
                ) : pending ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {editingProduct ? "Updating..." : "Creating..."}
                  </span>
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-start gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Products
                </h2>
                {filteredProducts.length > 0 && (
                  <span className="text-sm text-gray-500">
                    ({filteredProducts.length} of {products.length})
                  </span>
                )}
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterCategory !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by creating a new product"}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <ProductItem
                      key={product._id}
                      deleteProduct={() => deleteProduct(product._id as string)}
                      editProduct={handleEditProduct}
                      product={product}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;

function ProductItem({
  product,
  deleteProduct,
  editProduct,
}: {
  product: Product;
  deleteProduct: (id: string) => void;
  editProduct: (product: Product) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDeleteProduct() {
    if (!confirm(`Are you sure you want to delete "${product.title}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteProduct(product._id as string);
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 p-1 border border-zinc-300">
            <img
              className="h-16 w-16 object-contain rounded-lg"
              src={product.thumbnail}
              alt={product.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="ml-4 max-w-xs">
            <div className="text-sm font-medium text-gray-900 line-clamp-1">
              {product.title}
            </div>
            <div className="text-gray-500 line-clamp-2 text-sm">
              {product.description}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800">
          {product.categoryName}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        {handlePrice(product.price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.stock} items
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {product.stock > 0 ? (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
            In Stock
          </span>
        ) : (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-red-100 text-red-800">
            Out of Stock
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        {product.totalSales > 0 ? (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
            {handlePrice(product.totalSales)}
          </span>
        ) : (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-600">
            N/A
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        {product.ordersCount > 0 ? (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
            {product.ordersCount}
          </span>
        ) : (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-600">
            N/A
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => editProduct(product)}
            disabled={loading}
            className="text-blue-600 hover:text-blue-900 disabled:text-blue-300 transition-colors font-medium"
          >
            Edit
          </button>
          <button
            disabled={loading}
            onClick={handleDeleteProduct}
            className="text-red-600 hover:text-red-900 cursor-pointer duration-300 disabled:text-red-300 transition-colors font-medium"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
