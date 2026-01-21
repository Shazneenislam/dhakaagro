import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header/NavBar";
import Sidebar from "./components/Sidebar/Sidebar";
import HeroSection from "./components/HeroSection";
import FeaturedCategories from "./components/FeaturedCategories";
import Promotional from "./components/Promotional";
import BestSellers from "./components/AllProducts";
import Footer from "./components/Footer";

// Cart and Wishlist Panels
import CartPanel from "./components/CartPanel";
import WishlistPanel from "./components/WishlistPanel";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProductsProvider } from "./context/ProductsContext";
import { OrderProvider } from './context/OrderContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const handleOpenCart = () => setCartOpen(true);
  const handleOpenWishlist = () => setWishlistOpen(true);
  const handleCloseCart = () => setCartOpen(false);
  const handleCloseWishlist = () => setWishlistOpen(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleRouteChange = () => {
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [sidebarOpen]);

  return (
    <Router>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <OrderProvider>
              <WishlistProvider>
                <div className="min-h-screen bg-gray-50 flex">
                  {/* Mobile Overlay */}
                  {sidebarOpen && (
                    <div
                      onClick={() => setSidebarOpen(false)}
                      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                  )}

                  {/* Sidebar - Sticky on desktop */}
                  <div className={`
                    fixed lg:sticky lg:top-0
                    h-screen
                    z-40
                    transition-all duration-300
                    ${sidebarExpanded ? 'w-64' : 'w-16'}
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                  `}>
                    <Sidebar
                      isOpen={sidebarOpen}
                      onClose={() => setSidebarOpen(false)}
                      expanded={sidebarExpanded}
                      onToggleExpand={() => setSidebarExpanded(!sidebarExpanded)}
                    />
                  </div>

                  {/* Main Content */}
                  <div className={`
                    flex-1
                    min-h-screen
                    transition-all duration-300
                    ${sidebarExpanded ? 'lg:ml-64' : 'lg:ml-16'}
                    ${sidebarOpen ? 'ml-0' : ''}
                    w-full lg:w-auto
                  `}>
                    {/* Sticky Header */}
                    <div className="sticky top-0 z-30">
                      <Header
                        onMenuClick={() => setSidebarOpen(true)}
                        sidebarExpanded={sidebarExpanded}
                        onOpenCart={handleOpenCart}
                        onOpenWishlist={handleOpenWishlist}
                      />
                    </div>
                    
                    {/* Main Content Area */}
                    <main className="container mx-auto px-4 py-8">
                      <HeroSection />
                      <FeaturedCategories />
                      <Promotional />
                      <BestSellers />
                    </main>
                    
                    {/* Footer */}
                    <Footer />
                  </div>
                </div>

                {/* Cart Panel */}
                <CartPanel 
                  isOpen={cartOpen} 
                  onClose={handleCloseCart}
                />
                
                {/* Wishlist Panel */}
                <WishlistPanel 
                  isOpen={wishlistOpen} 
                  onClose={handleCloseWishlist}
                />

                {/* Toast Notifications */}
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 4000,
                      iconTheme: {
                        primary: '#425A8B',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 4000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </WishlistProvider>
            </OrderProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;