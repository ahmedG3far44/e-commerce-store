import { useState } from "react";

interface ProductImageProps {
  images: string[];
}

function ProductImage({ images }: ProductImageProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full rounded-2xl border border-zinc-300 bg-zinc-200 overflow-hidden group p-8">
        <img
          className="w-full h-full object-contain transition-transform rounded-xl duration-300"
          src={images[activeIndex]}
          alt={`Product image ${activeIndex + 1}`}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              aria-label="Previous image"
            >
              <svg
                className="w-5 h-5 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              aria-label="Next image"
            >
              <svg
                className="w-5 h-5 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2 my-4 scrollbar-hide">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 h-20 rounded-2xl flex items-center cursor-pointer justify-center overflow-hidden ${
                index === activeIndex
                  ? "ring-blue-500  scale-105 border-2 border-blue-500"
                  : "ring-gray-200 border-2 hover:ring-gray-300 opacity-70 border-transparent hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                className="w-full h-full object-cover"
                src={img}
                alt={`Thumbnail ${index + 1}`}
              />
              {index === activeIndex && (
                <div className="absolute inset-0 bg-blue-500/10" />
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default ProductImage;
