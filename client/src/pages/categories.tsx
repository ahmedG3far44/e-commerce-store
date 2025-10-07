import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/landing/Header";
import { getAllProducts } from "../utils/handlers";
import { IProduct } from "../utils/types";
import ProductCard from "../components/ProductCard";

// Types come from shared utils/types

interface FilterState {
  priceRange: [number, number];
  inStock: boolean | null;
  brands: string[];
  minRating: number;
  sortBy:
    | "price-asc"
    | "price-desc"
    | "name-asc"
    | "name-desc"
    | "newest"
    | "rating";
}

// function ProductCard({ product }: { product: IProduct }) {
//   return (
//     <article className="group bg-white rounded-xl flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border border-zinc-200 h-full">
//       <div className="relative w-full aspect-square overflow-hidden bg-zinc-100">
//         <img
//           src={product.images[0]}
//           alt={product.title}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         {product.stock === 0 && (
//           <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
//             <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
//               Out of Stock
//             </span>
//           </div>
//         )}
//       </div>

//       <div className="flex flex-col flex-1 p-4">
//         <h3 className="font-bold text-base text-zinc-900 mb-2 line-clamp-1">
//           {product.title}
//         </h3>
//         <p className="text-zinc-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
//           {product.description}
//         </p>

//         <div className="mt-auto pt-3 border-t border-zinc-100">
//           <div className="flex items-center justify-between">
//             <span className="text-2xl font-bold text-zinc-900">
//               ${product.price.toFixed(2)}
//             </span>
//             {product.stock > 0 && (
//               <button className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition text-sm font-medium">
//                 Add to Cart
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }

// Filter Component
function FilterSidebar({
  filters,
  onFilterChange,
  availableBrands,
  priceRange,
  totalProducts,
  filteredCount,
}: {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  availableBrands: string[];
  priceRange: [number, number];
  totalProducts: number;
  filteredCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (index: 0 | 1, value: string) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = parseFloat(value) || 0;
    onFilterChange({ priceRange: newRange });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ brands: newBrands });
  };

  const resetFilters = () => {
    onFilterChange({
      priceRange: priceRange,
      inStock: null,
      brands: [],
      minRating: 0,
      sortBy: "newest",
    });
  };

  const activeFilterCount = [
    filters.inStock !== null ? 1 : 0,
    filters.brands.length,
    filters.minRating > 0 ? 1 : 0,
    filters.priceRange[0] !== priceRange[0] ||
    filters.priceRange[1] !== priceRange[1]
      ? 1
      : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white border border-zinc-300 rounded-lg px-4 py-2.5 font-medium text-sm hover:bg-zinc-50 transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        <span className="text-sm text-zinc-600">
          {filteredCount} of {totalProducts} products
        </span>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        lg:block bg-white rounded-xl border border-zinc-200 p-6 space-y-6 h-fit lg:sticky lg:top-4
        ${isOpen ? "block fixed inset-0 z-50 overflow-y-auto" : "hidden"}
      `}
      >
        {/* Mobile Close Button */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-lg transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">Filters</h2>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="hidden lg:block p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-900">
            Showing <span className="font-bold">{filteredCount}</span> of{" "}
            <span className="font-bold">{totalProducts}</span> products
          </p>
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-zinc-900">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as FilterState["sortBy"],
              })
            }
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-zinc-900">
            Price Range
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <span className="text-zinc-400">-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-zinc-900">
            Availability
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                checked={filters.inStock === null}
                onChange={() => onFilterChange({ inStock: null })}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-700 group-hover:text-zinc-900">
                All Products
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                checked={filters.inStock === true}
                onChange={() => onFilterChange({ inStock: true })}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-700 group-hover:text-zinc-900">
                In Stock Only
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                checked={filters.inStock === false}
                onChange={() => onFilterChange({ inStock: false })}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-700 group-hover:text-zinc-900">
                Out of Stock
              </span>
            </label>
          </div>
        </div>

        {/* Brands */}
        {availableBrands.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-zinc-900">
              Brand {filters.brands.length > 0 && `(${filters.brands.length})`}
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-zinc-700 group-hover:text-zinc-900">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-zinc-900">
            Minimum Rating
          </label>
          <div className="space-y-2">
            {[4, 3, 2, 1, 0].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  checked={filters.minRating === rating}
                  onChange={() => onFilterChange({ minRating: rating })}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-1">
                  {rating === 0 ? (
                    <span className="text-sm text-zinc-700">All Ratings</span>
                  ) : (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? "text-yellow-400" : "text-zinc-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-zinc-700 ml-1">& up</span>
                    </>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button (Mobile) */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
        )}
      </aside>
    </>
  );
}

// Main Category Page Component
function CategoryPage() {
  const { categoryName } = useParams();

  console.log(categoryName);
  const [category] = useState(categoryName);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    inStock: null,
    brands: [],
    minRating: 0,
    sortBy: "newest",
  });

  const [allProducts, setDisplayProducts] = useState<IProduct[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function handleGetProducts() {
      try {
        setIsLoading(true);
        const products: IProduct[] = await getAllProducts();
        if (products) {
          console.log(products);
          const filterCategoryProducts = products.filter(
            (product) =>
              (product.category ?? "").toLocaleLowerCase() ===
              (categoryName ?? "").toLocaleLowerCase()
          );
          setDisplayProducts(filterCategoryProducts as IProduct[]);
        }
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    handleGetProducts();
  }, []);

  // Calculate price range from all products
  const absolutePriceRange = useMemo<[number, number]>(() => {
    const prices = allProducts.map((p) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [allProducts]);

  // Initialize price range filter
  useEffect(() => {
    setFilters((prev) => ({ ...prev, priceRange: absolutePriceRange }));
  }, [absolutePriceRange]);

  // Get available brands
  const availableBrands = useMemo(() => {
    const brands = new Set(
      allProducts.map((p) => p.brand).filter(Boolean) as string[]
    );
    return Array.from(brands).sort();
  }, [allProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by price
    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filter by stock
    if (filters.inStock === true) {
      filtered = filtered.filter((p) => p.stock > 0);
    } else if (filters.inStock === false) {
      filtered = filtered.filter((p) => p.stock === 0);
    }

    // Filter by brands
    if (filters.brands.length > 0) {
      filtered = filtered.filter(
        (p) => p.brand && filters.brands.includes(p.brand)
      );
    }

    // Filter by rating
    if (filters.minRating > 0) {
      filtered = filtered.filter((p) => (p.rating || 0) >= filters.minRating);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProducts, filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <Header />
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                {category}
              </h1>
              <p className="text-sm text-zinc-600 mt-1">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}{" "}
                available
              </p>
            </div>
            <nav className="hidden sm:flex items-center gap-2 text-sm text-zinc-600">
              <a href="/" className="hover:text-zinc-900">
                Home
              </a>
              <span>/</span>
              <a href="/categories" className="hover:text-zinc-900">
                Categories
              </a>
              <span>/</span>
              <span className="text-zinc-900 font-medium">{category}</span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              availableBrands={availableBrands}
              priceRange={absolutePriceRange}
              totalProducts={allProducts.length}
              filteredCount={filteredProducts.length}
            />
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="w-full min-h-screen flex items-start justify-center">
                <div className="mt-20 w-8 h-8 rounded-full border-2 border-r-transparent border-t-transparent bg-transparent animate-spin duration-300"></div>
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
                    <svg
                      className="w-16 h-16 text-zinc-300 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-zinc-600 mb-4">
                      Try adjusting your filters to see more results
                    </p>
                    <button
                      onClick={() =>
                        handleFilterChange({
                          priceRange: absolutePriceRange,
                          inStock: null,
                          brands: [],
                          minRating: 0,
                        })
                      }
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id} {...product} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CategoryPage;
