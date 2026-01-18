import React, { useEffect } from "react";
import { useProducts } from "../context/ProductsContext";
import { Link } from "react-router-dom";

const FeaturedCategories = () => {
  const { 
    featuredCategories, 
    loading, 
    fetchFeaturedCategories,
    fetchCategories 
  } = useProducts();

  useEffect(() => {
    // Only fetch if we haven't loaded categories yet
    const loadCategories = async () => {
      try {
        await fetchCategories();
        await fetchFeaturedCategories();
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    
    loadCategories();
  }, []); // Empty dependency array to run only once

  // Import category icons
  const categoryIcons = {
    'Fruit': '/img/Fruit.png',
    'Vegetable': '/img/vegetablecard.png',
    'Drink & Food': '/img/foodcard.png',
    'Meat': '/img/meat.png',
    'Fish': '/img/fish.png',
    'Grocery': '/img/grocery.png',
    'Milk & Dairy': '/img/dairy.png',
    'Frozen Food': '/img/frozenfood.png'
  };

  // Fallback categories if API returns empty
  const defaultCategories = [
    { _id: '1', name: 'Fruit', slug: 'fruit', icon: '/img/Fruit.png', subcategories: ["Fresh Fruit", "Frozen Fruit", "Seasonal Fruit", "Dried Fruit"] },
    { _id: '2', name: 'Vegetable', slug: 'vegetable', icon: '/img/vegetablecard.png', subcategories: ["Fresh Vegetable", "Frozen Vegetable", "Seasonal Vegetable", "Root Vegetable"] },
    { _id: '3', name: 'Drink & Food', slug: 'drink-food', icon: '/img/foodcard.png', subcategories: ["All Restaurant", "Juice and Drinks", "Breakfast", "Fast Food"] },
    { _id: '4', name: 'Meat', slug: 'meat', icon: '/img/meat.png', subcategories: ["Beef & Steak", "Chicken", "Mutton & Goat", "Lamb"] },
    { _id: '5', name: 'Fish', slug: 'fish', icon: '/img/fish.png', subcategories: ["Dried Fish", "Fish Filling & Steaks", "Frozen Seafood", "Prawn Shrimp"] },
    { _id: '6', name: 'Grocery', slug: 'grocery', icon: '/img/grocery.png', subcategories: ["Canned & Packed Food", "Beauty Products", "Masala & Spices", "Dry Fruits & Nut"] },
    { _id: '7', name: 'Milk & Dairy', slug: 'milk-dairy', icon: '/img/dairy.png', subcategories: ["Cheese", "Milk & Cream", "Yogurt", "Eggs"] },
    { _id: '8', name: 'Frozen Food', slug: 'frozen-food', icon: '/img/frozenfood.png', subcategories: ["Ice Cream & Toppings", "Frozen Snacks", "Frozen Meals", "Frozen Dairy & Desserts"] }
  ];

  // Use featured categories if available, otherwise use all categories, otherwise fallback
  const categoriesToShow = featuredCategories && featuredCategories.length > 0 
    ? featuredCategories 
    : defaultCategories;

  console.log("📂 FeaturedCategories debug:", {
    loading: loading.categories,
    featuredCategoriesCount: featuredCategories?.length,
    categoriesToShowCount: categoriesToShow?.length,
    categoriesToShow
  });

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
        {loading.categories ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#425a8b] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {categoriesToShow.map((category) => (
              <Link
                key={category._id || category.id}
                to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="relative bg-white p-6 shadow-[0px_0px_50px_5px_#D9D9D9] rounded-2xl hover:shadow-[0px_0px_50px_10px_#C9C9C9] transition-all duration-300"
              >
                <div className="flex items-start mb-4">
                  <div className="h-16 w-16 mr-4 flex-shrink-0">
                    <img
                      src={category.icon || categoryIcons[category.name] || '/img/placeholder.png'}
                      alt={category.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = '/img/placeholder.png';
                        console.error(`Image failed to load for category: ${category.name}`);
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-[#425a8b] pt-2">
                    {category.name}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {category.subcategories && category.subcategories.length > 0 ? (
                    category.subcategories.map((sub, index) => (
                      <div
                        key={index}
                        className="flex items-center text-gray-700 hover:text-[#425a8b] hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
                      >
                        <span className="w-2 h-2 bg-[#425a8b] rounded-full mr-3"></span>
                        <span className="text-sm">{typeof sub === 'string' ? sub : sub.name}</span>
                      </div>
                    ))
                  ) : (
                    // If no subcategories, show some defaults
                    <div className="text-gray-500 italic text-sm p-2">
                      No subcategories available
                    </div>
                  )}
                </div>
                
                <button 
                  className="absolute bottom-4 right-4 text-xs font-medium bg-[#d5dfe4] hover:bg-[#c5d5e4] text-[#2c3e50] px-3 py-1.5 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle view all click
                    console.log(`View all clicked for ${category.name}`);
                  }}
                >
                  View All
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategories;