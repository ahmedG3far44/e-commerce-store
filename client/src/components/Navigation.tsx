import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { Category } from "./admin/CategoryListTable";

interface NavigationProps {
  categories: Category[];
}

const Navigation: React.FC<NavigationProps> = ({ categories }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const visibleCategories = categories.slice(0, 3);
  const dropdownCategories = categories.slice(3);
  const getCategoryUrl = (categoryName: string) => {
    return `/category/${categoryName
      .toLowerCase()
      .split(" ")
      .join("-")
      .trim()}`;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16 lg:h-20">
        <div className="flex items-center space-x-8 flex-1">
          <nav className="hidden lg:flex items-center space-x-1">
            {/* First 3 Categories */}
            {visibleCategories.map((category) => (
              <Link
                key={category._id}
                to={getCategoryUrl(category.name)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                {category.name}
              </Link>
            ))}

            {dropdownCategories.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                {/* More Button */}
                <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-1">
                  More
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                    {dropdownCategories.map((category) => (
                      <Link
                        key={category._id}
                        to={getCategoryUrl(category.name)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
