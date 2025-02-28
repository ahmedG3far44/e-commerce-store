function ProductImage({ images }: { images: string[] | [] }) {
  return (
    <div className="flex flex-col justify-start items-start gap-4">
      <div className="flex-1 w-[400px] h-3/4 rounded-md overflow-hidden object-cover">
        <img src={images[0]} alt="" />
      </div>
      <div className="flex-1 flex h-full items-center justify-between gap-4 p-2">
        {images.map((img: string, index: number) => {
          return (
            <div key={index} className="w-20 h-20 rounded-md overflow-hidden ">
              <img className="w-full h-full" src={img} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductImage;
