import Container from "../components/Container";
import Header from "../components/Header";
import ProductCart from "../components/ProductCart";
import { useEffect, useState } from "react";
import { getAllProducts } from "../utils/handlers";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState<string | undefined>("");
  useEffect(() => {
    getAllProducts()
      .then((products) => {
        console.log(products);
        setProducts(products);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      });
  }, []);
  console.log(error);
  return (
    <Container>
      <Header />
      <div className="w-full flex max-sm:flex-col justify-center items-center m-auto flex-wrap gap-4 ">
        {error && (
          <div className="w-[200px] bg-rose-200 border-rose-800 text-rose-600 p-2 rounded-md">
            {error}
          </div>
        )}

        {products?.length ? (
          products.map(
            ({ _id, title, description, images, price, stock, category }) => (
              <ProductCart
                key={_id}
                productId={_id}
                title={title}
                description={description}
                images={images}
                category={category}
                price={price}
                stock={stock}
              />
            )
          )
        ) : (
          <h1 className="text-gray-400">No products available</h1>
        )}
      </div>
    </Container>
  );
}

export default HomePage;
