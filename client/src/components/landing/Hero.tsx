import React, { useState, useEffect } from "react";
import {
  FaShippingFast,
  FaMoneyBillWave,
  FaShieldAlt,
  FaCertificate,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCategory } from "../../context/category/CategoryContext";
import { handlePrice } from "../../utils/handlers";

interface CountdownProps {
  targetHours: number;
  targetMinutes: number;
  targetSeconds: number;
}

const Countdown: React.FC<CountdownProps> = ({
  targetHours,
  targetMinutes,
  targetSeconds,
}) => {
  const [time, setTime] = useState({
    hours: targetHours,
    minutes: targetMinutes,
    seconds: targetSeconds,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2">
      <TimeUnit value={time.hours} label="Hours" />
      <span className="text-white text-xl font-bold">:</span>
      <TimeUnit value={time.minutes} label="Mins" />
      <span className="text-white text-xl font-bold">:</span>
      <TimeUnit value={time.seconds} label="Secs" />
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <div className="flex flex-col items-center bg-white rounded-md px-3 py-2 min-w-[60px]">
    <span className="text-2xl font-bold text-gray-900">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-gray-100 rounded-lg p-6 flex items-start gap-4 hover:bg-gray-200 transition-colors">
    <div className="text-3xl text-gray-700 mt-1">{icon}</div>
    <div>
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

// interface ProductCategory {
//   _id: string;
//   icon: string;
//   name: string;
//   image: string;
// }

const Hero: React.FC = () => {
  const [categoryPage, setCategoryPage] = useState(0);

  // const categories: ProductCategory[] = [
  //   {
  //     _id: "1",
  //     icon: "🤖",
  //     name: "Printers & Scanners",
  //     image:
  //       "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&h=200&fit=crop",
  //   },
  //   {
  //     _id: "2",
  //     icon: "📱",
  //     name: "Tablets",
  //     image:
  //       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop",
  //   },
  //   {
  //     _id: "3",
  //     icon: "🎧",
  //     name: "Headphones",
  //     image:
  //       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
  //   },
  //   {
  //     _id: "4",
  //     icon: "🌐",
  //     name: "Networking Devices",
  //     image:
  //       "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=300&h=200&fit=crop",
  //   },
  //   {
  //     _id: "5",
  //     icon: "⌚",
  //     name: "Smartwatches",
  //     image:
  //       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
  //   },
  //   {
  //     _id: "6",
  //     icon: "📱",
  //     name: "Smartphones",
  //     image:
  //       "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
  //   },
  //   {
  //     _id: "7",
  //     icon: "💼",
  //     name: "PC Accessories",
  //     image:
  //       "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop",
  //   },
  //   {
  //     _id: "8",
  //     icon: "💻",
  //     name: "Gaming Laptops",
  //     image:
  //       "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=200&fit=crop",
  //   },
  //   {
  //     _id: "9",
  //     icon: "🖥️",
  //     name: "Monitors",
  //     image:
  //       "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop",
  //   },
  //   {
  //     _id: "10",
  //     icon: "🖥️",
  //     name: "PC Components",
  //     image:
  //       "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&h=200&fit=crop",
  //   },
  // ];
  const { categories } = useCategory();
  const getItemsPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 2;
      if (window.innerWidth < 1024) return 4;
      return 5;
    }
    return 5;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
      setCategoryPage(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = categoryPage * itemsPerPage;
  const visibleCategories = categories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevCategory = () => {
    setCategoryPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextCategory = () => {
    setCategoryPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-purple-900 to-black rounded-2xl p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-10 right-10 w-64 h-64 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full">
            <div className="flex-1 mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                The Best Place To
                <br />
                Find And Buy
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                  Amazing Products
                </span>
              </h1>
              <p className="text-gray-300 mb-8">
                Grab the best deals on the latest gadgets
              </p>

              <div className="flex items-center gap-4 mb-8">
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Products 5000+
                </span>
              </div>
            </div>

            <div className="flex-1 flex justify-center items-center">
              <img
                src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500&h=500&fit=crop"
                alt="VR Experience"
                className="w-full max-w-md object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          <div className="absolute bottom-8 left-8 flex gap-4">
            <img
              src="https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=100&h=100&fit=crop"
              alt="Product"
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300 rounded-full opacity-30 blur-2xl"></div>

            <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-xs font-semibold inline-block mb-4">
              Limited Week Deal
            </span>

            <p className="text-sm text-gray-700 mb-2">
              Hurry Up! Offer ends In:
            </p>

            <Countdown targetHours={7} targetMinutes={23} targetSeconds={53} />

            <div className="mt-6 flex justify-end">
              <img
                src="https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=200&h=200&fit=crop"
                alt="VR Headset"
                className="w-32 h-32 object-contain drop-shadow-lg"
              />
            </div>

            <div className="mt-4">
              <span className="text-2xl font-bold text-orange-600">
                {handlePrice(2500)}
              </span>
              <span className="text-sm text-gray-500 line-through ml-2">
                {handlePrice(3000)}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-800 to-red-950 rounded-2xl p-6 relative overflow-hidden text-white">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-black opacity-50"></div>

            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">
                Redefine your world
                <br />
                with 150mp camera
              </h3>

              <div className="absolute top-0 right-0 bg-orange-500 px-3 py-1 rounded-bl-lg">
                <p className="text-xs">SAVE UP TO</p>
                <p className="text-3xl font-bold">70%</p>
                <p className="text-xs">OFF</p>
              </div>
            </div>

            <div className="relative z-10 mt-20">
              <img
                src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=200&fit=crop"
                alt="Smartphone"
                className="w-full h-32 object-contain"
              />

              <button className="bg-white text-red-800 px-6 py-2 rounded-lg font-semibold text-sm mt-4 hover:bg-gray-100 transition-colors">
                SHOP NOW
              </button>

              <p className="text-xs mt-2 opacity-80">Use Code: 0102444</p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <FeatureCard
          icon={<FaShippingFast />}
          title="Free Shipping"
          description="Available for orders above ₹1000"
        />
        <FeatureCard
          icon={<FaMoneyBillWave />}
          title="Cash On Delivery"
          description="Available for orders above ₹500"
        />
        <FeatureCard
          icon={<FaShieldAlt />}
          title="Secure Payment"
          description="Safe shopping guarantee"
        />
        <FeatureCard
          icon={<FaCertificate />}
          title="Warranty Policy"
          description="30 days Money back guarantee"
        />
      </div>

      <h2 className="text-xl sm:text-2xl text-center font-bold text-gray-900">
        Category Products Collections
      </h2>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={handlePrevCategory}
              disabled={totalPages <= 1}
              className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 sm:p-3 rounded-lg transition-colors"
              aria-label="Previous categories"
            >
              <FaChevronLeft className="text-sm sm:text-base" />
            </button>
            <button
              onClick={handleNextCategory}
              disabled={totalPages <= 1}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 sm:p-3 rounded-lg transition-colors"
              aria-label="Next categories"
            >
              <FaChevronRight className="text-sm sm:text-base" />
            </button>
          </div>
        </div>
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 transition-all duration-300">
            {visibleCategories.map((category) => (
              <div
                key={category._id}
                className="bg-gray-100 rounded-xl p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center hover:bg-gray-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-full aspect-[4/3] mb-3 sm:mb-4 overflow-hidden rounded-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <Link
                  to={`/category/${category.name
                    .toLocaleLowerCase()
                    .split(" ")
                    .join("-")
                    .trim()}`}
                  className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {category.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCategoryPage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === categoryPage
                    ? "bg-blue-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
