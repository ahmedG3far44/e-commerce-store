import { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiZap,
  FiArrowRight,
  FiStar,
  FiTruck,
  FiShield,
} from "react-icons/fi";
import { BsLightning, BsHeadphones, BsKeyboard, BsMouse } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";

interface HeroProps {
  onShopNowClick?: () => void;
  onViewCollectionClick?: () => void;
}

function Hero({ onShopNowClick, onViewCollectionClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: <FiTruck className="w-5 h-5" />,
      text: "Free Shipping",
    },
    {
      icon: <FiShield className="w-5 h-5" />,
      text: "2 Year Warranty",
    },
    {
      icon: <FiStar className="w-5 h-5" />,
      text: "Premium Quality",
    },
  ];

  const heroSlides = [
    {
      title: "Elevate Your Gaming Setup",
      subtitle: "Premium PC Accessories & Peripherals",
      badge: "NEW ARRIVAL",
      image:
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=600&fit=crop",
    },
    {
      title: "Professional Audio Experience",
      subtitle: "Studio-Grade Headphones & Sound",
      badge: "BEST SELLER",
      image:
        "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&h=600&fit=crop",
    },
    {
      title: "Ultimate Productivity",
      subtitle: "Mechanical Keyboards & Precision Mice",
      badge: "TOP RATED",
      image:
        "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=800&h=600&fit=crop",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Badge Bar */}
        <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-300 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
            >
              {feature.icon}
              <span className="text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30">
              <HiSparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-blue-300">
                {heroSlides[currentSlide].badge}
              </span>
              <BsLightning className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                {heroSlides[currentSlide].title
                  .split(" ")
                  .map((word, index) => (
                    <span
                      key={index}
                      className={`inline-block ${
                        index ===
                          heroSlides[currentSlide].title.split(" ").length -
                            1 ||
                        index ===
                          heroSlides[currentSlide].title.split(" ").length - 2
                          ? "bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
                          : ""
                      }`}
                    >
                      {word}{" "}
                    </span>
                  ))}
              </h1>
              <p className="text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
                {heroSlides[currentSlide].subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-lg max-w-lg mx-auto lg:mx-0">
              Discover locally crafted, premium-quality electronics designed for
              performance, comfort, and style. Elevate your workspace today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onShopNowClick}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Shop Now
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button
                onClick={onViewCollectionClick}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                View Collection
                <FiTrendingUp className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Happy Customers</div>
              </div>
              <div className="h-12 w-px bg-gray-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-sm text-gray-400">Products</div>
              </div>
              <div className="h-12 w-px bg-gray-700"></div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-3xl font-bold text-white">
                  4.9
                  <FiStar className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            {/* Main Product Image */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500"></div>

              {/* Image Container */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-2 border border-white/10 shadow-2xl overflow-hidden">
                <img
                  src={heroSlides[currentSlide].image}
                  alt="Featured Product"
                  className="w-full h-[500px] object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Product Cards */}
                <div className="absolute top-6 -left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <BsHeadphones className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Gaming Audio</div>
                      <div className="font-bold text-gray-900">50% OFF</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 -right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <BsKeyboard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Accessories</div>
                      <div className="font-bold text-gray-900">Hot Deal</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 -left-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white p-3 rounded-full shadow-xl animate-bounce-slow">
                  <FiZap className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-3 mt-6 justify-center flex-wrap">
              {[
                { icon: <BsHeadphones />, label: "Audio" },
                { icon: <BsKeyboard />, label: "Keyboards" },
                { icon: <BsMouse />, label: "Mice" },
                { icon: <FiZap />, label: "Accessories" },
              ].map((category, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
                >
                  {category.icon}
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-blue-500"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}

export default Hero;
