import { useState, useEffect } from "react";

function ImageSlider({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Set up the interval
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center  overflow-hidden relative rounded-2xl ">
      <img
        loading="lazy"
        src={images[activeIndex]}
        alt={`Slide ${activeIndex}`}
        className="w-full h-full object-cover hover:scale-105 transition duration-150 "
      />
      {images.length > 1 && (
        <div className="absolute bottom-5 z-50 flex items-center gap-1 border border-zinc-200 p-2 rounded-4xl bg-zinc-200/50 shadow-md hover:bg-zinc-200/10 duration-150 hover:scale-105 ">
          {images.map((_, index) => (
            <span
              onClick={() => setActiveIndex(index)}
              key={index}
              className={`${
                index === activeIndex ? "bg-sky-500" : "bg-zinc-100"
              } block rounded-full w-2 h-2 cursor-pointer`}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageSlider;
