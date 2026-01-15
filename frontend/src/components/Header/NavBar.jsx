import React, { useState } from "react";
import { Search, User, Heart, Phone, ShoppingCart, Menu } from "lucide-react";
import CartPanel from "../CartPanel";
import WishlistPanel from "../WishlistPanel";
import LoginRegisterModal from "./LoginRegisterModal";

const Header = ({ isAuthenticated = false, onMenuClick, sidebarExpanded = true }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState("login");

  const handleLoginClick = () => {
    setModalDefaultTab("login");
    setLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setModalDefaultTab("register");
    setLoginModalOpen(true);
  };

  return (
    <>
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
                    <button
                      onClick={handleLoginClick}
                      className="hover:text-blue-600 cursor-pointer"
                    >
                      Log in
                    </button>
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
          <div className="flex items-center gap-6 text-[#425A8B]">
            {/* Shopping Cart with Counter */}
            <div className="relative">
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                aria-label="Open cart"
              >
                <ShoppingCart size={22} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* User */}
            <button
              onClick={handleLoginClick}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Account"
            >
              <User size={22} />
            </button>

            {/* Wishlist with Counter */}
            <div className="relative">
              <button
                onClick={() => setWishlistOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                aria-label="Open wishlist"
              >
                <Heart size={22} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  4
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Right Side Panels */}
      <CartPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistPanel isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      
      {/* Login/Register Modal */}
      <LoginRegisterModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        defaultTab={modalDefaultTab}
      />
    </>
  );
};

export default Header;