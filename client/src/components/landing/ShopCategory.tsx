import { categories } from "../../utils/handlers";
function ShopCategory() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <a key={category.id} href={category.path} className="group">
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition transform hover:-translate-y-1 hover:shadow-lg relative">
                <div className="h-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.categoryName}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4 absolute left-0 bottom-0 z-50  text-zinc-50 bg-zinc-900/40 w-full h-full flex flex-col justify-end">
                  <h3 className="font-bold text-2xl mb-1">
                    {category.categoryName}
                  </h3>
                  <p className="text-zinc-100 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    {/* Shop Now <ChevronRight className="ml-1 h-4 w-4" /> */}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopCategory;
