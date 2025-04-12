/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/landing/Header";
import Container from "../components/Container";
import handelDates from "../utils/handelDates";
import ProductInfo, { ProductInfoProps } from "../components/ProductInfo";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function ProductDetails() {
  const { id } = useParams();
  const [productInfo, setProductInfo] = useState<ProductInfoProps | null>(null);

  useEffect(() => {
    if (!id) return;
    async function getProductById(productId: string) {
      try {
        const response = await fetch(`${BASE_URL}/product/${productId}`);

        if (!response.ok) {
          throw new Error("can't get Product details, check your connection!!");
        }

        const productInfo = await response.json();

        setProductInfo({ ...productInfo });

        return productInfo;
      } catch (err: any) {
        toast.error(err?.message);
        console.error(err?.message);
        return;
      }
    }
    getProductById(id);
  }, [id]);
  if (!productInfo) return;
  const date = handelDates(productInfo?.createdAt);
  return (
    <Container>
      <Header />
      <ProductInfo
        productId={id!}
        title={productInfo.title}
        description={productInfo.description}
        category={productInfo.category}
        images={productInfo.images}
        price={productInfo.price}
        stock={productInfo.stock}
        createdAt={date}
      />
    </Container>
  );
}

export default ProductDetails;
