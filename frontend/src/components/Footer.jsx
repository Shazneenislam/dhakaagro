import React from 'react';

const Footer = () => {
  const footerLinks = {
    'Quick Links': ['Home', 'Blogs', 'Products', 'Contract Us', 'About Us'],
    'Categories': ['Fruits', 'Vegetables', 'Meat', 'Dairy', 'Beverages'],
    'Support': ['FAQ', 'Shipping', 'Returns', 'Privacy Policy', 'Terms of Service'],
  };

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">Betafore</h3>
            <p className="text-gray-300">Your one-stop shop for fresh, organic, and high-quality products delivered to your doorstep.</p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-lg font-bold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Betafore E-commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;