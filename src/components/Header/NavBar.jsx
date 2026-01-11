import React from 'react';

const Header = () => {
  const features = [
    { text: "Free Delivery", subtext: "From all orders over $10" },
    { text: "Support 24/7", subtext: "Shop with an expert" },
    { text: "Gift voucher", subtext: "Refer a friend" },
    { text: "Return & Refund", subtext: "Free return over $200" },
    { text: "Secure payment", subtext: "100% Protected" },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="text-2xl font-bold text-green-600 mb-4 md:mb-0">Betafore</div>
          <div className="w-full md:w-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="font-semibold text-gray-800">{feature.text}</div>
                  <div className="text-sm text-gray-600">{feature.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;  // Ensure this line is present