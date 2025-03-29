/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../context/auth/AuthContext";
import UploadedImages from "./UploadedImages";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export interface File {
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
  const [uploadedImagesList, setImagesList] = useState<string[]>([]);
  const [files, setFiles] = useState<File[] | []>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
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
      const files: File[] = imagesRef?.current?.files as File[];
      setFiles([...files]);

      const imagesUpload = await uploadImages(files);

      // make sure the response is returned correct
      if (!imagesUpload) throw new Error("can't upload files to S3!!");
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

      toast.success("a new product was added successful!!");

      addProductFormRef?.current?.reset();
      return data;
    } catch (err: any) {
      console.log(err?.message);
      setError(err?.message);
      toast.error(err?.message);
      return err;
    } finally {
      setPending(false);
    }
  };

  const uploadImages = async (files: any[]) => {
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

      setImagesList([...images]);

      toast.success("uploaded images success!!");
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
          <UploadedImages uploaded={files} />
        </div>

        <div className="w-full flex items-center gap-4">
          <input
            className="p-2 border bg-white border-gray-200 rounded-md w-full"
            name="image"
            type="file"
            multiple
            accept="image/*"
            ref={imagesRef}
            onChange={(e) => setFiles([...e?.target?.files])}
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
          <option value="electronics">Electronics</option>
          <option value="clothes">Clothes</option>
          <option value="laptops">Laptops</option>
          <option value="tools">Tools</option>
        </select>
        <textarea
          className="p-2 border bg-white border-gray-200 rounded-md w-full"
          name="description"
          id="description"
          placeholder="product title"
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
