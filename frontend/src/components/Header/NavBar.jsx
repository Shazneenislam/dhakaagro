import React, { useState } from "react";
import { Search, User, Heart, Phone, ShoppingCart, Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import CartPanel from "../CartPanel";
import WishlistPanel from "../WishlistPanel";
import LoginRegisterModal from "./LoginRegisterModal";

const Header = ({ onMenuClick, sidebarExpanded = true }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState("login");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const handleLoginClick = () => {
    setModalDefaultTab("login");
    setLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setModalDefaultTab("register");
    setLoginModalOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdown(false);
  };

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-30">
        {/* ================= TOP BAR ================= */}
        <div className="text-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-[#425A8B]">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/about')}
                className="hover:text-blue-600 cursor-pointer"
              >
                About Us
              </button>
              <span>|</span>
              <button 
                onClick={() => navigate('/contact')}
                className="hover:text-blue-600 cursor-pointer"
              >
                Contact Us
              </button>
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
                    <button
                      onClick={handleRegisterClick}
                      className="hover:text-blue-600 cursor-pointer"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileDropdown(!isProfileDropdown)}
                        className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                      >
                        <User size={16} />
                        <span>{user?.name || "Account"}</span>
                      </button>
                      
                      {/* Profile Dropdown */}
                      {isProfileDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                navigate('/profile');
                                setIsProfileDropdown(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              My Profile
                            </button>
                            <button
                              onClick={() => {
                                navigate('/orders');
                                setIsProfileDropdown(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              My Orders
                            </button>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                            >
                              <LogOut size={16} className="mr-2" />
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setWishlistOpen(true)}
                      className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
                    >
                      <Heart size={16} />
                      <span>Wishlist</span>
                    </button>
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
          <button onClick={() => navigate('/')} className="cursor-pointer">
            <img
              src="/Logo.png"
              alt="Dhaka Agro"
              className="h-12 w-[250px] object-contain"
            />
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center h-[37px] w-[540px] bg-white border border-[#d8dee4] rounded-[10px] overflow-hidden">
            <select className="h-full px-3 text-sm text-[#425A8B] bg-transparent border-r border-[#d8dee4] outline-none">
              <option>All categories</option>
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for items"
              className="flex-1 h-full px-3 text-sm text-gray-700 outline-none bg-transparent"
            />

            <button
              type="submit"
              className="h-full px-3 flex items-center justify-center text-[#425A8B] hover:text-blue-600"
            >
              <Search size={18} />
            </button>
          </form>

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
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </button>
            </div>

            {/* User */}
            {!isAuthenticated ? (
              <button
                onClick={handleLoginClick}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Account"
              >
                <User size={22} />
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdown(!isProfileDropdown)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Account"
                >
                  <User size={22} />
                </button>
              </div>
            )}

            {/* Wishlist with Counter */}
            <div className="relative">
              <button
                onClick={() => setWishlistOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                aria-label="Open wishlist"
              >
                <Heart size={22} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
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