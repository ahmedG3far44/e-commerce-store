import { BsArrowRight } from "react-icons/bs";

function Hero() {
  return (
    <section className="relative bg-blue-600 text-white overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Elevate Your Setup
            </h1>

            <p className="text-xl text-blue-50 leading-relaxed max-w-md">
              Locally crafted mouse pads and PC accessories designed for
              performance, comfort, and style.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/category/gaming-mouse-pads"
                className="group inline-flex items-center gap-2 bg-white text-blue-600 font-semibold py-4 px-8 rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:gap-3"
              >
                Shop Now
                <BsArrowRight className="h-5 w-5" />
              </a>

              <a
                href="/category/designer-collections"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold py-4 px-8 rounded-full hover:bg-white hover:text-blue-600 transition-all"
              >
                View Collection
              </a>
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="../../../public/images/headset.jpg"
                alt="Premium Gaming Setup"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
