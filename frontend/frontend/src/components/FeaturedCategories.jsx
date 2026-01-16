// components/FeaturedCategories.js - With imports
import React from "react";

// Import category icons
import FruitIcon from "./img/Fruit.png";
import VegetableIcon from "./img/vegetablecard.png";
import FoodIcon from "./img/foodcard.png";
import MeatIcon from "./img/meat.png";
import FishIcon from "./img/fish.png";
import GroceryIcon from "./img/grocery.png";
import DairyIcon from "./img/dairy.png";
import FrozenFoodIcon from "./img/frozenfood.png";
import RiceBowl from "./img/ricebowl2.png";
import Card2 from "./img/card2.png";
import Card3 from "./img/card3.png";

const FeaturedCategories = () => {
  const categories = [
    { id: 1, title: "Fruit", icon: FruitIcon, subcategories: ["Fresh Fruit", "Frozen Fruit", "Seasonal Fruit", "Dried Fruit"] },
    { id: 2, title: "Vegetable", icon: VegetableIcon, subcategories: ["Fresh Vegetable", "Frozen Vegetable", "Seasonal Vegetable", "Root Vegetable"] },
    { id: 3, title: "Drink & Food", icon: FoodIcon, subcategories: ["All Restaurant", "Juice and Drinks", "Breakfast", "Fast Food"] },
    { id: 4, title: "Meat", icon: MeatIcon, subcategories: ["Beef & Steak", "Chicken", "Mutton & Goat", "Lamb"] },
    { id: 5, title: "Fish", icon: FishIcon, subcategories: ["Dried Fish", "Fish Filling & Steaks", "Frozen Seafood", "Prawn Shrimp"] },
    { id: 6, title: "Grocery", icon: GroceryIcon, subcategories: ["Canned & Packed Food", "Beauty Products", "Masala & Spices", "Dry Fruits & Nut"] },
    { id: 7, title: "Milk & Dairy", icon: DairyIcon, subcategories: ["Cheese", "Milk & Cream", "Yogurt", "Eggs"] },
    { id: 8, title: "Frozen Food", icon: FrozenFoodIcon, subcategories: ["Ice Cream & Toppings", "Frozen Snacks", "Frozen Meals", "Frozen Dairy & Desserts"] }
  ];

  return (
    <section className="bg-white py-10 md:py-15 lg:py-20">
      {/* Title Section */}
      <div className="flex w-full lg:w-1/2 font-sans-serif justify-center items-center mx-auto px-4">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#425a8b] leading-tight">
            Featured Categories
          </h1>
          <p className="text-sm md:text-lg lg:text-2xl font-normal text-[#425a8b]/60 leading-tight pt-3 pb-5 md:pb-8">
            Choose your necessary product from this feature categories
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative bg-white p-6 shadow-[0px_0px_50px_5px_#D9D9D9] rounded-2xl hover:shadow-[0px_0px_50px_10px_#C9C9C9] transition-all duration-300"
            >
              <div className="flex items-start mb-4">
                <div className="h-16 w-16 mr-4 flex-shrink-0">
                  <img
                    src={category.icon}
                    alt={category.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#425a8b] pt-2">
                  {category.title}
                </h3>
              </div>
              
              <div className="space-y-2">
                {category.subcategories.map((sub, index) => (
                  <div
                    key={index}
                    className="flex items-center text-gray-700 hover:text-[#425a8b] hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <span className="w-2 h-2 bg-[#425a8b] rounded-full mr-3"></span>
                    <span className="text-sm">{sub}</span>
                  </div>
                ))}
              </div>
              
              <button className="absolute bottom-4 right-4 text-xs font-medium bg-[#d5dfe4] hover:bg-[#c5d5e4] text-[#2c3e50] px-3 py-1.5 rounded-lg transition-colors">
                View All
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;