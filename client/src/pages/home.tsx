import Container from "../components/Container";
import ProductCart from "../components/ProductCart";
import products from "../utils/products";

function HomePage() {
  return (
    <Container>
      <div className="w-full flex max-sm:flex-col justify-center items-center flex-wrap gap-4 ">
        {products?.length ? (
          products.map((product, index) => (
            <ProductCart
              key={index}
              id={product.id}
              title={product.title}
              description={product.description}
              images={product.images}
              category={product.category}
              price={product.price}
              stock={product.stock}
            />
          ))
        ) : (
          <h1>No products available</h1>
        )}
      </div>
    </Container>
  );
}

export default HomePage;
