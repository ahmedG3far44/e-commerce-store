import { BiChevronRight } from "react-icons/bi";
import { useCategory } from "../../context/category/CategoryContext";
import { Link } from "react-router-dom";

function ShopCategory() {
  const { categories, pending, error } = useCategory();

  if (error)
    return (
      <div className="p-2 rounded-md border-rose-500 bg-rose-200 text-red-500 ">
        <p>{error}</p>
      </div>
    );
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <>
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition transform hover:-translate-y-1 hover:shadow-lg relative">
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4 absolute left-0 bottom-0 z-50  text-zinc-50 bg-zinc-900/40 w-full h-full flex flex-col justify-end">
                  <h3 className="font-bold text-2xl mb-1">{category.name}</h3>
                  <p className="text-zinc-300 text-[12px] line-clamp-2  mb-3">
                    {category.description}
                  </p>
                  <Link
                    key={category._id}
                    to={`/category/${category.name
                      .toLocaleLowerCase()
                      .split(" ")
                      .join("-")
                      .trim()}`}
                    className="flex items-center hover:text-blue-500 duration-300 underline font-medium text-white p-2 rounded-md w-fit"
                  >
                    Shop Now <BiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopCategory;
