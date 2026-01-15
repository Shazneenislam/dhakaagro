// components/HeroSection.js
import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-transparent flex items-center justify-center p-">
      <div className="bg-transparent container max-w-10xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Hero Card */}
          <div className="relative bg-[#f8fbf0] rounded-3xl p-5 md:p-7 shadow-[0px_0px_100px_0px_#d6d6d6] w-full lg:w-2/3 overflow-hidden">
            <div className="bg-[#fe9917] px-3 py-1 inline-flex items-center mt-15 mb-1">
              <span className="text-white text-[8px] lg:text-sm font-medium tracking-wide">
                100% ORGANIC PRODUCT
              </span>
            </div>

            <div className="w-full md:w-1/2 font-sans-serif">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Buy Delicious Produce Enjoy Free Shipping
              </h1>

              <a
                href="#"
                className="mt-6 md:mt-12 inline-flex items-center justify-center rounded-full border border-lime-400 px-3 py-1 text-sm font-medium text-lime-600 shadow-sm hover:bg-white transition-colors"
              >
                BUY NOW
              </a>
            </div>

            {/* Mobile Image */}
            <div className="lg:hidden absolute right-0 bottom-0 top-[55%] left-[53%] w-1/2 md:w-1/2 h-48 md:h-64 overflow-hidden pointer-events-none">
              <img
                src="img/FruitTag.png"
                alt="FruitsTag"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Desktop Image */}
            <div className="hidden lg:block absolute right-0 top-[20%] bottom-0 w-full md:w-full lg:w-1/2 h-48 md:h-64 lg:h-full overflow-hidden pointer-events-none">
              <img
                src="img/FruitTag.png"
                alt="FruitsTag"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Side Cards */}
          <div className="flex flex-col gap-6 w-full lg:w-1/3">
            {/* Side Card 1 */}
            <div className="relative bg-[#e5e5e5] rounded-3xl p-6 shadow-[0px_0px_100px_0px_#d6d6d6] h-64 overflow-hidden">
              <h2 className="text-[#dc0701] text-4xl md:text-3xl font-bold font-serif text-center leading-tight">
                <span className="block justify-center items-center">Taste of</span>
                <span className="block justify-center items-center">South Asia</span>
              </h2>

              <div className="mt-4 items-center justify-center text-center">
                <a
                  href="#"
                  className="inline-flex rounded-full border border-[#dc0701] px-2 py-1 text-sm font-medium text-[#dc0701] shadow-sm hover:bg-white transition-colors"
                >
                  BUY NOW
                </a>
              </div>

              <img
                src="img/Food.png"
                alt="Food"
                className="absolute right-0 top-[59%] bottom-0 w-full md:w-full object-contain"
              />
            </div>

            {/* Side Card 2 */}
            <div className="relative bg-[#f4ffeb] rounded-3xl p-6 shadow-[0px_0px_100px_0px_#d6d6d6] h-64 overflow-hidden">
              <div className="bg-[#d0ebb9] px-1 py-0 rounded-full inline-flex items-center">
                <span className="text-black text-[10px] font-medium tracking-wide px-1 py-1">
                  100% ORGANIC PRODUCT
                </span>
              </div>

              <h2 className="mt-2 text-xl md:text-2xl w-[50%] font-semibold text-gray-900">
                Buy Delicious Produce Enjoy Free Shopping
              </h2>

              <div className="mt-1">
                <a
                  href="#"
                  className="mt-6 md:mt-1 inline-flex items-center justify-center rounded-full border border-lime-400 px-3 py-1 text-sm font-medium text-lime-600 shadow-sm hover:bg-white transition-colors"
                >
                  BUY NOW
                </a>
              </div>

              <img
                src="img/Vegetable.png"
                alt="Fresh Vegetables"
                className="absolute right-0 bottom-0 w-2/3 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;