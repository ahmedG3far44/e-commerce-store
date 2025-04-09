function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ELEVATE YOUR SETUP
            </h1>
            <p className="text-lg mb-6">
              Locally crafted mouse pads and PC accessories designed for
              performance, comfort, and style.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center bg-white text-blue-600 font-medium py-3 px-6 rounded-lg hover:bg-blue-50 transition"
            >
              {/* SHOP NOW <ArrowRight className="ml-2 h-5 w-5" /> */}
            </a>
          </div>
          <div className="md:w-1/2">
            <img
              src="/images/hero-setup.png"
              alt="Premium Gaming Setup"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
