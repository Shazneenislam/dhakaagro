// components/Sidebar/Sidebar.js
import React, { useState } from "react";
import {
  Apple,
  Carrot,
  Utensils,
  Beef,
  Fish,
  ShoppingBag,
  Milk,
  Snowflake,
  X,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// Import category icons for sidebar
import FruitIcon from "../img/Fruit.png";
import VegetableIcon from "../img/vegetablecard.png";
import FoodIcon from "../img/foodcard.png";
import MeatIcon from "../img/meat.png";
import FishIcon from "../img/fish.png";
import GroceryIcon from "../img/grocery.png";
import DairyIcon from "../img/dairy.png";
import FrozenFoodIcon from "../img/frozenfood.png";

const sidebarCategories = [
  { 
    id: 1, 
    title: "Fruit", 
    icon: FruitIcon,
    lucideIcon: Apple,
    subcategories: ["Fresh Fruit", "Frozen Fruit", "Seasonal Fruit", "Dried Fruit"]
  },
  { 
    id: 2, 
    title: "Vegetable", 
    icon: VegetableIcon,
    lucideIcon: Carrot,
    subcategories: ["Fresh Vegetable", "Frozen Vegetable", "Seasonal Vegetable", "Root Vegetable"]
  },
  { 
    id: 3, 
    title: "Drink & Food", 
    icon: FoodIcon,
    lucideIcon: Utensils,
    subcategories: ["All Restaurant", "Juice and Drinks", "Breakfast", "Fast Food"]
  },
  { 
    id: 4, 
    title: "Meat", 
    icon: MeatIcon,
    lucideIcon: Beef,
    subcategories: ["Beef & Steak", "Chicken", "Mutton & Goat", "Lamb"]
  },
  { 
    id: 5, 
    title: "Fish", 
    icon: FishIcon,
    lucideIcon: Fish,
    subcategories: ["Dried Fish", "Fish Filling & Steaks", "Frozen Seafood", "Prawn Shrimp"]
  },
  { 
    id: 6, 
    title: "Grocery", 
    icon: GroceryIcon,
    lucideIcon: ShoppingBag,
    subcategories: ["Canned & Packed Food", "Beauty Products", "Masala & Spices", "Dry Fruits & Nut"]
  },
  { 
    id: 7, 
    title: "Milk & Dairy", 
    icon: DairyIcon,
    lucideIcon: Milk,
    subcategories: ["Cheese", "Milk & Cream", "Yogurt", "Eggs"]
  },
  { 
    id: 8, 
    title: "Frozen Food", 
    icon: FrozenFoodIcon,
    lucideIcon: Snowflake,
    subcategories: ["Ice Cream & Toppings", "Frozen Snacks", "Frozen Meals", "Frozen Dairy & Desserts"]
  }
];

const Sidebar = ({ isOpen, onClose, expanded = true, onToggleExpand }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleSubcategoryClick = (categoryId, subcategory) => {
    console.log(`Navigating to: ${categoryId} - ${subcategory}`);
    // Add your navigation logic here
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed min-h-full inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Full Height Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen
          bg-white border-r border-[#d8dee4]
          shadow-lg
          z-50 transition-all duration-300 ease-in-out
          flex flex-col
          ${expanded ? "w-64" : "w-16"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Section - Toggle & Close */}
        <div className="flex justify-between items-center p-4 border-b border-[#d8dee4] h-16 shrink-0">
          {/* Logo when expanded */}
          {expanded && (
            <div className="flex items-center">
              <img
                src="/Logo.png"
                alt="Dhaka Agro"
                className="h-12 w-[250px] object-contain"
              />
            </div>
          )}
          
          {/* Collapsed logo */}
          {!expanded && (
            <img
              src="/Logo2.png"
              alt="Dhaka Agro"
              className="h-12 w-[250px] object-contain"
            />
          )}
          
          <div className="flex items-center gap-2">
            {/* Desktop Toggle Button */}
            <button
              onClick={onToggleExpand}
              className="
                w-8 h-8
                flex items-center justify-center
                rounded-full
                text-[#425A8B]
                hover:bg-[#F2F4F7]
                transition
                hidden lg:flex
              "
              title={expanded ? "Collapse sidebar" : "Expand sidebar"}
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronLeft 
                size={20} 
                className={`transition-transform ${expanded ? "" : "rotate-180"}`}
              />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="
                w-8 h-8
                flex items-center justify-center
                rounded-full
                text-[#425A8B]
                hover:bg-[#F2F4F7]
                transition
                lg:hidden
              "
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation - Scrollable with thin scrollbar */}
        <div className={`
          flex-1 overflow-y-auto py-4 sidebar-scroll
          ${!expanded ? 'overflow-y-visible' : ''}
        `}>
          <div className="space-y-1 px-2">
            {sidebarCategories.map((category) => (
              <div key={category.id} className="mb-1">
                {/* Main Category Button */}
                <button
                  onClick={() => {
                    if (expanded) {
                      toggleCategory(category.id);
                    }
                    handleCategoryClick(category.id);
                  }}
                  className={`
                    w-full
                    flex items-center
                    rounded-lg
                    py-3 px-3
                    transition-all duration-200
                    group
                    relative
                    ${activeCategory === category.id 
                      ? "bg-[#425A8B] text-white shadow-sm" 
                      : "text-[#425A8B] hover:bg-[#F2F4F7] hover:shadow-sm"
                    }
                    ${!expanded ? 'justify-center' : ''}
                  `}
                >
                  {/* Icon - Use image when expanded, lucide icon when collapsed */}
                  <div className={`
                    flex items-center justify-center
                    ${expanded ? 'w-8' : 'w-full'}
                    ${activeCategory === category.id ? 'text-white' : 'text-[#425A8B]'}
                  `}>
                    {expanded ? (
                      <img
                        src={category.icon}
                        alt={category.title}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <category.lucideIcon size={20} />
                    )}
                  </div>
                  
                  {/* Category Title */}
                  {expanded && (
                    <div className="flex items-center justify-between flex-1 ml-3">
                      <span className="text-sm font-medium whitespace-nowrap">
                        {category.title}
                      </span>
                      {expandedCategories[category.id] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!expanded && (
                    <div className="
                      absolute left-full top-1/2 -translate-y-1/2 ml-2
                      px-2 py-1.5
                      bg-gray-800 text-white text-xs rounded
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-200
                      pointer-events-none
                      z-50
                      whitespace-nowrap
                      shadow-lg
                      before:content-[''] before:absolute before:-left-1 before:top-1/2 before:-translate-y-1/2
                      before:border-t-[5px] before:border-b-[5px] before:border-r-[5px]
                      before:border-t-transparent before:border-b-transparent before:border-r-gray-800
                    ">
                      {category.title}
                    </div>
                  )}
                  
                  {/* Active indicator for collapsed state */}
                  {!expanded && activeCategory === category.id && (
                    <div className="
                      absolute -right-1 top-1/2 -translate-y-1/2
                      w-1 h-6
                      bg-[#425A8B]
                      rounded-l
                    " />
                  )}
                </button>

                {/* Subcategories - Only show when expanded and category is expanded */}
                {expanded && expandedCategories[category.id] && (
                  <div className="ml-8 mt-1 space-y-1">
                    {category.subcategories.map((subcategory, index) => (
                      <button
                        key={index}
                        onClick={() => handleSubcategoryClick(category.id, subcategory)}
                        className="
                          w-full
                          flex items-center
                          rounded-lg
                          py-2 px-3
                          text-sm
                          text-gray-600
                          hover:text-[#425A8B]
                          hover:bg-[#F2F4F7]
                          transition-all duration-200
                        "
                      >
                        <span className="w-2 h-2 bg-[#425A8B] rounded-full mr-3"></span>
                        <span className="whitespace-nowrap truncate">{subcategory}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* View All Categories Button */}
        {expanded && (
          <div className="p-4 border-t border-[#d8dee4]">
            <button
              className="
                w-full
                py-3
                bg-[#d5dfe4]
                hover:bg-[#c5d5e4]
                text-[#2c3e50]
                text-sm font-medium
                rounded-lg
                transition-colors
                flex items-center justify-center
              "
              onClick={() => console.log("View All Categories clicked")}
            >
              <ShoppingBag size={16} className="mr-2" />
              View All Categories
            </button>
          </div>
        )}
      </aside>

      {/* Inline styles for thin scrollbar */}
      <style jsx>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 2px;
          margin: 4px 0;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* When sidebar is collapsed, hide scrollbar and show all items */
        .w-16 .sidebar-scroll {
          overflow-y: visible !important;
          scrollbar-width: none;
        }
        
        .w-16 .sidebar-scroll::-webkit-scrollbar {
          display: none !important;
        }
        
        /* Adjust spacing for collapsed state */
        .w-16 .sidebar-scroll > div {
          padding-bottom: 1rem; /* Add some bottom padding */
        }
      `}</style>
    </>
  );
};

export default Sidebar;