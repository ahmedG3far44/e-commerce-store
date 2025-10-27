import { IProduct } from "../../utils/types";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../utils/handlers";
import ProductCard from "../ProductCard";

function FeaturedProducts() {
  const [displayProducts, setDisplayProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleGetProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const products = await getAllProducts();
        setDisplayProducts(products as IProduct[]);
      } catch (err: unknown) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    handleGetProducts();
  }, []);

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Featured Products
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Discover our handpicked selection of premium products
          </p>
        </div>
        {isLoading && (
          <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-gray-500 text-sm sm:text-base">
              Loading products...
            </p>
          </div>
        )}
        {!isLoading && error && (
          <div className="flex flex-col justify-center items-center min-h-[400px] px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 max-w-md w-full text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-red-800 text-sm sm:text-base font-medium">
                {error}
              </p>
            </div>
          </div>
        )}
        {!isLoading && !error && displayProducts.length === 0 && (
          <div className="flex flex-col justify-center items-center min-h-[400px] px-4">
            <div className="text-center max-w-md">
              <svg
                className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No Products Available
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                Check back soon for new products!
              </p>
            </div>
          </div>
        )}
        {!isLoading && !error && displayProducts.length > 0 && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-center content-center">
            {displayProducts.slice(1, 9).map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
