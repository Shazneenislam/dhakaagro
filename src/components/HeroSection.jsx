import React from 'react';

const HeroSection = () => {
  const heroItems = [
    { title: 'Farm Fresh Vegetable', subtitle: 'Sale 30% Off', buttonText: 'BUY NOW', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { title: 'Fresh Meat', subtitle: 'Upto 13% off', buttonText: 'BUY NOW', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    { title: 'Fresh Fruit Drink', subtitle: '15% off in Fresh', buttonText: 'BUY NOW', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  ];

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {heroItems.map((item, index) => (
          <div key={index} className={`${item.bgColor} rounded-lg p-6 flex flex-col justify-between h-64`}>
            <div>
              <h3 className={`text-2xl font-bold ${item.textColor} mb-2`}>{item.title}</h3>
              <p className={`text-lg ${item.textColor} opacity-80`}>{item.subtitle}</p>
            </div>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300 self-start">
              {item.buttonText}
            </button>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Everyday Fresh & Clean With Our Products</h2>
        <p className="text-lg mb-6">Food Delivery Service</p>
        <button className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300">
          START SHOPPING
        </button>
      </div>
    </section>
  );
};

export default HeroSection;  // Ensure this line is present