import noValidImage from "../../public/no-image.jpg";

export interface ProductCartProps {
  id?: number;
  title: string;
  description?: string;
  category?: string;
  images: string[];
  price: number;
  stock: number;
}
function ProductCart({
  title,
  description,
  category,
  images,
  price,
  stock,
}: ProductCartProps) {
  return (
    <div className="w-full h-[400px] md:w-1/2 lg:w-[350px] p-4 rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
      <div className="w-full h-full overflow-hidden rounded-md relative">
        <img
          className="w-full h-full object-cover"
          src={images[0] ? images[0] : noValidImage}
          alt="img"
        />
        <span className="bg-rose-50/20 p-1 w-8 h-8 flex justify-center items-center rounded-full text-rose-400  shadow-md absolute top-4 right-4">{stock}</span>
      </div>

      <div className="flex-1 mt-auto w-full min-h-1/2 flex flex-col justify-start items-start gap-2">
        <h1 className="text-xl font-bold text-zinc-800">{title}</h1>
        <span className="w-fit py-1 px-4 rounded-2xl text-sm  bg-blue-50 border-blue-600 text-blue-600">
          {category}
        </span>
        <p className="text-zinc-400 text-start">{description}</p>
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col justify-start items-start gap-1">
            <span>${price}</span>
          </div>
          <button className="px-2 py-1 rounded-md bg-blue-500 cursor-pointer text-white hover:bg-blue-700 duration-150">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCart;
