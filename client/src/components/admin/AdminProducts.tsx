/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
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
  title: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  stock: number;
}

function AdminProducts() {
  const { token } = useAuth();
  // const [uploadedImagesList, setImagesList] = useState<string[]>([]);
  const [files, setFiles] = useState<CustomFile[] | []>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<{
    success?: boolean;
    url?: string[];
    error?: string;
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

  const handelAddNewProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!token) return;
      setPending(true);
      // upload files first to S3 bucket
      const files: CustomFile[] = imagesRef?.current?.files as CustomFile[];
      setFiles([...files]);
      console.log(uploadResult?.url);
      const imagesUpload = await uploadImages(files as File[]);

      // make sure the response is returned correct
      if (!imagesUpload || imagesUpload.length <= 0)
        throw new Error("can't upload files to S3!!");
      console.log("image url :");
      console.log(imagesUpload);
      setUploadResult({
        success: true,
        url: imagesUpload,
      });

      // make add new product  request
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

      if (!response.ok) throw new Error("can't add a new product!!");

      const data = await response.json();

      if (!data) throw new Error("can't get a new product!!");

      if (addProductFormRef.current) {
        setError(null);
        addProductFormRef?.current?.reset();
      }
      toast.success("a new product was added successful!!");
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
        throw new Error("connection failed please check your connection!!");
      }

      const data = await response.json();

      if (!data) throw new Error("can't get data!");

      const { images } = data;

      // setImagesList([...images]);
      return images;
    } catch (err: any) {
      console.log(err?.message);
      toast.error(err?.message);
      return;
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <form
        ref={addProductFormRef}
        onSubmit={handelAddNewProduct}
        className="w-1/2 mt-20 p-4 bg-gray-100 rounded-md border border-gray-200 flex flex-col justify-start items-start gap-4"
      >
        {error && (
          <div className="p-4 w-full rounded-md border-rose-500 text-rose-500 bg-rose-100 text-center font-semibold ">
            {error}
          </div>
        )}

        <div>
          <UploadedImages uploaded={files as File[]} />
        </div>

        <div className="w-full flex items-center gap-4">
          <label
            htmlFor="image"
            className="p-4 border border-dashed rounded-md bg-white border-zinc-500 hover:bg-zinc-100 duration-150 cursor-pointer text-sm text-zinc-600 w-full h-[100px] flex flex-col items-center justify-center"
          >
            <h1>Upload your product images</h1>
            <span>here</span>
          </label>
          <input
            className="hidden p-2 border bg-white border-gray-200 rounded-md w-full"
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

          {/* <button onClick={() => uploadImages}>upload</button> */}
        </div>
        <input
          className="p-2 border bg-white border-gray-200 rounded-md w-full"
          type="text"
          name="title"
          placeholder="product title"
          ref={titleRef}
        />
        <select
          className="p-2 border bg-white border-gray-200 rounded-md w-full"
          name="category"
          id="category"
          ref={categoryRef}
        >
          {categories.map((category) => {
            const categorySlug = category.path
              .split("/")[2]
              .split("-")
              .join(" ");
            return <option value={categorySlug}>{categorySlug}</option>;
          })}
        </select>
        <textarea
          className="p-2 border bg-white border-gray-200 rounded-md w-full"
          name="description"
          id="description"
          placeholder="product description"
          ref={descriptionRef}
        />
        <div className="flex w-full items-center gap-4 ">
          <input
            ref={priceRef}
            className="p-2 border bg-white border-gray-200 rounded-md w-full"
            type="number"
            name="price"
            placeholder="price EGP"
          />
          <input
            ref={stockRef}
            className="p-2 border bg-white border-gray-200 rounded-md w-full"
            type="number"
            name="stock"
            placeholder="stock"
          />
        </div>
        <input
          className="p-2 bg-blue-500 text-white rounded-md w-full cursor-pointer disabled:bg-zinc-500 disabled:cursor-not-allowed hover:bg-blue-800"
          type="submit"
          disabled={pending}
          value={pending ? "creating new product..." : "Add Product"}
        />
      </form>
    </div>
  );
}

export default AdminProducts;
