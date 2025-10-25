import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/landing/Header";
import Container from "../components/Container";
import ProductInfo from "../components/ProductInfo";
import RelatedProducts from "../components/landing/RelatedProducts";
import { IProduct } from "../utils/types";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function ProductDetails() {
  const { id } = useParams();
  const [productInfo, setProductInfo] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function getProductById(productId: string) {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/product/${productId}`);
        if (!response.ok) {
          throw new Error("Can't get product details, check your connection!");
        }
        const productInfo = await response.json();
        setProductInfo({ ...productInfo });
        return productInfo;
      } catch (err: any) {
        toast.error(err?.message);
        console.error(err?.message);
        return;
      } finally {
        setLoading(false);
      }
    }

    getProductById(id);
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Container>
    );
  }

  if (!productInfo) {
    return (
      <Container>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 text-lg">Product not found</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <div className="py-8">
        <ProductInfo {...productInfo} />
        <div className="mt-16">
          <RelatedProducts
            categoryName={productInfo.categoryName}
            currentProductId={id!}
          />
        </div>
      </div>
    </Container>
  );
}

export default ProductDetails;
