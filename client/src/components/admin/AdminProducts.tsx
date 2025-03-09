/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

interface File {
  lastModified: number;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

function AdminProducts() {
  const [uploadedImagesList, setImagesList] = useState<string[]>([]);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const imagesRef = useRef(null);
  const priceRef = useRef(null);
  const stockRef = useRef(null);

  const handelAddNewProduct = async (e) => {
    e.preventDefault();
    const files: File[] = imagesRef?.current?.files as File[];

    // console.log(titleRef?.current?.value);
    // console.log(categoryRef?.current?.value);
    // console.log(descriptionRef?.current?.value);
    // const files: File[] = imagesRef?.current?.files;
    const formData = new FormData();

    for (const file of files) {
      formData.append("image", file);
    }

    console.log(formData);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("connection failed please check your connection!!");
    }

    const data = await response.json();
    console.log(data.images);

    setImagesList([...data.images]);
  };
  // const handelUploadFiles = async (formData: FormData) => {
  //   try {
  //     // const formData = new FormData();
  //     const files: File[] = imagesRef?.current?.files as File[];

  //     if (!files) {
  //       throw new Error("no files uploaded!!");
  //     }
  //     formData.set("image", files);

  //     const response = await fetch(`${BASE_URL}/upload`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error("connection failed please check your connection!!");
  //     }

  //     const data = await response.json();
  //     console.log(data);
  //     if (!data) throw new Error("no data returns!!");

  //     setImagesList([...data.images]);
  //     return data;
  //   } catch (err: any) {
  //     console.error(err?.message);
  //     return err;
  //   }
  // };
  return (
    <div>
      <form
        onSubmit={handelAddNewProduct}
        className="w-[400px] p-4 bg-gray-100 rounded-md border border-gray-200 flex flex-col justify-start items-start gap-4"
      >
        {uploadedImagesList.length > 0 && (
          <div className="flex justify-between items-center gap-4 flex-wrap">
            {uploadedImagesList.map((img, index) => {
              return (
                <div
                  key={index}
                  className="bg-zinc-500 rounded-md overflow-hidden"
                >
                  <img width={60} height={60} src={img} alt={""} />
                </div>
              );
            })}
          </div>
        )}
        <div className="w-full flex items-center gap-4">
          <input
            className="p-2 border bg-white border-gray-200 rounded-md w-full"
            name="image"
            type="file"
            multiple
            accept="image/*"
            ref={imagesRef}
          />
          <button>upload</button>
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
            className="p-2 border bg-white border-gray-200 rounded-md w-full"
            type="number"
            name="price"
            placeholder="price EGP"
          />
          <input
            className="p-2 border bg-white border-gray-200 rounded-md w-full"
            type="number"
            name="stock"
            placeholder="stock"
          />
        </div>
        <input
          className="p-2 bg-blue-500 text-white rounded-md w-full cursor-pointer hover:bg-blue-800"
          type="submit"
          value={"add product"}
        />
      </form>
    </div>
  );
}

export default AdminProducts;
