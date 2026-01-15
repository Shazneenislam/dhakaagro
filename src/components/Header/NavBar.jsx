// components/Header/NavBar.js
import React from "react";
import { Search, User, Heart, Phone, ShoppingCart, Menu } from "lucide-react";

const Header = ({ isAuthenticated = false, onMenuClick, sidebarExpanded = true }) => {
  return (
    <header className="bg-white border-b sticky top-0 z-30">
      {/* ================= TOP BAR ================= */}
      <div className="text-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-[#425A8B]">
          {/* Left */}
          <div className="flex items-center gap-4">
            <span className="hover:text-blue-600 cursor-pointer">About Us</span>
            <span>|</span>
            <span className="hover:text-blue-600 cursor-pointer">Contact Us</span>
          </div>

          {/* Center */}
          <div>
            Free shipping for all orders over{" "}
            <span className="text-green-600 font-semibold">$75.00</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>Need help? Call Us:</span>
              <span className="text-green-600 font-semibold">+1800 900</span>
            </div>

            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <span className="hover:text-blue-600 cursor-pointer">Log in</span>
                  <span>|</span>
                  <span className="hover:text-blue-600 cursor-pointer">Register</span>
                </>
              ) : (
                <>
                  <span className="hover:text-blue-600 cursor-pointer">Account</span>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                    <Heart size={16} />
                    <span>Wishlist</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        {/* Hamburger */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} className="text-[#425A8B]" />
        </button>

        {/* Logo */}
        <img
          src="/Logo.png"
          alt="Dhaka Agro"
          className="h-12 w-[250px] object-contain"
        />

        {/* Search */}
        <div className="flex items-center h-[37px] w-[540px] bg-white border border-[#d8dee4] rounded-[10px] overflow-hidden">
          <select className="h-full px-3 text-sm text-[#425A8B] bg-transparent border-r border-[#d8dee4] outline-none">
            <option>All categories</option>
          </select>

          <input
            type="text"
            placeholder="Search for items"
            className="flex-1 h-full px-3 text-sm text-gray-700 outline-none bg-transparent"
          />

          <button
            type="button"
            className="h-full px-3 flex items-center justify-center text-[#425A8B] hover:text-blue-600"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-[#425A8B]">
          <ShoppingCart size={22} className="cursor-pointer" />
          <User size={22} className="cursor-pointer" />
        </div>

        {/* Navigation */}
        <nav className="ml-auto hidden lg:flex gap-8 text-sm font-medium">
          <span className="text-[#425A8B] hover:underline cursor-pointer">Home</span>
          <span className="text-[#425A8B] hover:underline cursor-pointer">Products</span>
          <span className="text-[#425A8B] hover:underline cursor-pointer">Blogs</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;