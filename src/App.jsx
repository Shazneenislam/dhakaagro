import React from 'react';
import Header from './components/Header/NavBar';
import HeroSection from './components/HeroSection';
import TopSellingProducts from './components/TopSellingProducts';
import CategorySection from './components/CategorySection';
import FeaturedCategories from './components/FeaturedCategories';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;