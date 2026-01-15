// App.js - Updated
import React, { useState } from "react";
import Header from "./components/Header/NavBar";
import Sidebar from "./components/Sidebar/Sidebar";
import HeroSection from "./components/HeroSection";
import FeaturedCategories from "./components/FeaturedCategories";
import Promotional from "./components/Promotional";
import BestSellers from "./components/AllProducts"; // Import BestSellers
import Footer from "./components/Footer";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Sticky on desktop */}
      <div className={`
        fixed lg:sticky lg:top-0
        h-screen
        z-50
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
        ${sidebarExpanded ? 'lg:ml-0' : 'lg:ml-0'}
        ${sidebarOpen ? 'ml-0' : ''}
      `}>
        {/* Sticky Header */}
        <div className="sticky top-0 z-30">
          <Header
            isAuthenticated={false}
            onMenuClick={() => setSidebarOpen(true)}
            sidebarExpanded={sidebarExpanded}
          />
        </div>
        
        {/* Main Content Area */}
        <main className="container mx-auto px-4 py-8">
          <HeroSection />
          <FeaturedCategories />
          <Promotional />
          {/* Use BestSellers instead of ProductCard directly */}
          <BestSellers />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;