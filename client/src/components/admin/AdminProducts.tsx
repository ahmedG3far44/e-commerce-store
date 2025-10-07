/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "../../context/auth/AuthContext";
import UploadedImages from "./UploadedImages";
import { categories } from "../../utils/handlers";


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
  category: string;
  images: string[];
  price: number;
  stock: number;
  createdAt?: string;
}

function AdminProducts() {
  const { token } = useAuth();
  const [files, setFiles] = useState<CustomFile[] | []>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [uploadedResults, setUploadResult] = useState<{
    success?: boolean;
    url?: string[];
    error?: string | null;
  } | null>({
    success: false,
    url: [""],
    error: "",
  });
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<any>(null);
  const addProductFormRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const categoryRef = useRef<any>(null);
  const imagesRef = useRef<any>(null);
  const priceRef = useRef<any>(null);
  const stockRef = useRef<any>(null);

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRemoveSelectedFile = (removedFile: File) => {
    const filterFiles = files.filter((file) => file !== removedFile);
    setFiles(filterFiles);
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
      if (!token) return;

      setPending(true);

      const files: CustomFile[] = imagesRef?.current?.files as CustomFile[];
      setFiles([...files]);

      const imagesUpload = await uploadImages(files as File[]);

      if (!imagesUpload || imagesUpload.length <= 0)
        throw new Error("Can't upload files to S3!");

      setUploadResult({
        success: true,
        url: imagesUpload,
      });

      const product: Product = {
        title: titleRef?.current?.value as string,
        description: descriptionRef?.current?.value as string,
        category: categoryRef?.current?.value as string,
        images: imagesUpload,
        price: parseFloat(priceRef?.current?.value),
        stock: parseInt(stockRef?.current?.value),
      };

      const response = await fetch(`${BASE_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error("Can't add a new product!");

      const data = await response.json();

      if (!data) throw new Error("Can't get a new product!");

      if (addProductFormRef.current) {
        setError(null);
        addProductFormRef?.current?.reset();
        setFiles([]);
      }

      toast.success("Product added successfully!");
      fetchProducts();
      return data;
    } catch (err: any) {
      console.log(err?.message);
      setError(err?.message);
      setUploadResult({
        success: false,
        error: err?.message,
      });
      toast.error(err?.message);
      return err;
    } finally {
      setPending(false);
    }
  };

  const uploadImages = async (files: File[]) => {
    try {
      setUploadResult({
        success: true,
        error: null,
      });
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
        throw new Error("Connection failed, please check your connection!");
      }

      const data = await response.json();

      if (!data) throw new Error("Can't get data!");

      const { images } = data;
      return images;
    } catch (err: any) {
      console.log(err?.message);
      toast.error(err?.message);
      setUploadResult({
        error: (err as Error).message,
        success: false,
      });
      return;
    } finally {
      setUploadResult((prev) => ({
        ...prev,
        success: false,
      }));
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setPending(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete product");
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen  py-8 px-4">
      <div className="max-w-7xl h-screen mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>

        {/* Add Product Form - Shopify Style */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Add New Product
            </h2>
          </div>

          <form
            ref={addProductFormRef}
            onSubmit={handelAddNewProduct}
            className="p-6"
          >
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Title */}
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
                />
              </div>

              {/* Description */}
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
                />
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media
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
                    onChange={(e) => {
                      if (e.target.files) {
                        setFiles(Array.from(e.target.files));
                      }
                    }}
                  />
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center cursor-pointer"
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
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="mt-4">
                    <UploadedImages
                      uploadStatus={uploadedResults?.success as boolean}
                      removeFiles={handleRemoveSelectedFile}
                      uploaded={files as File[]}
                    />
                    {uploadedResults?.success && (
                      <div className="flex items-center justify-start gap-2">
                        <span className="w-2 h-2 border-r-transparent border-t-transparent rounded-full border-2 border-zinc-500 animate-spin"></span>{" "}
                        <p className="text-sm text-zinc-500 font-semibold">
                          uploading...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Category, Price, Stock */}
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
                  >
                    {categories.map((category, index) => {
                      const categorySlug = category.path
                        .split("/")[2]
                        .split("-")
                        .join(" ");
                      return (
                        <option key={index} value={categorySlug}>
                          {categorySlug}
                        </option>
                      );
                    })}
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
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                type="submit"
                disabled={pending}
              >
                {pending ? (
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
                    Creating product...
                  </span>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-zinc-200 rounded-lg shadow-sm ">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-start gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Products
                </h2>
                {filteredProducts.length > 0 && (
                  <div className="bg-zinc-200 text-sm px-6 py-4 border-t border-gray-200">
                    <p className="text-sm text-zinc-400">
                      Showing{" "}
                      <span className="font-medium">
                        {filteredProducts.length}
                      </span>{" "}
                      of <span className="font-medium">{products.length}</span>{" "}
                      products
                    </p>
                  </div>
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
                  {categories.map((category, index) => {
                    const categorySlug = category.path
                      .split("/")[2]
                      .split("-")
                      .join(" ");
                    return (
                      <option key={index} value={categorySlug}>
                        {categorySlug}
                      </option>
                    );
                  })}
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <ProductItem
                      key={product._id}
                      deleteProduct={deleteProduct}
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
}: {
  product: Product;
  deleteProduct: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  async function handleDeleteProduct() {
    try {
      setLoading(true);
      await deleteProduct(product._id!);
    } catch (error) {
      console.log((error as Error).message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <tr className="hover:bg-zinc-300 duration-300 transition-colors bg-zinc-100">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <img
              className="h-16 w-16 object-cover"
              src={product.images[0] || "/placeholder.svg"}
              alt={product.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 line-clamp-1">
              {product.title}
            </div>
            <div className=" text-gray-500 line-clamp-1 text-sm max-w-[250px] overflow-x-hidden">
              {product.description}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800">
          {product.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        {product.price} EGP
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.stock} units
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
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          disabled={loading}
          onClick={handleDeleteProduct}
          className="text-red-600 disabled:text-red-900 duration-300 hover:text-red-900 transition-colors"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </td>
    </tr>
  );
}
