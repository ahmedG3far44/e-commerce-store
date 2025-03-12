import { useState } from "react";

function ProductImage({ images }: { images: string[] | [] }) {
  const [activeImage, setActiveImage] = useState<string>(images[0]);
  return (
    <div className=" flex flex-col justify-center items-center gap-4 p-4">
      <div className="w-full h-[500px] flex justify-center items-center rounded-3xl  overflow-hidden border border-zinc-100">
        <img className="w-full h-full object-cover" src={activeImage} alt="" />
      </div>
      <div className="flex  items-center justify-between gap-4 p-2">
        {images.map((img: string, index: number) => {
          return (
            <div
              role="button"
              key={index}
              onClick={() => setActiveImage(img)}
              className="w-20 h-20 rounded-md overflow-hidden hover:scale-1.1 cursor-pointer "
            >
              <img
                className={` w-full h-full rounded-md ${
                  img === activeImage && "p-2 border-2 border-zinc-400"
                }`}
                src={img}
                alt=""
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductImage;
