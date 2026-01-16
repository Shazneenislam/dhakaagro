import React from "react";

// Import promotional images
import RiceBowl from "./img/ricebowl2.png";
import Card2 from "./img/card2.png";
import Card3 from "./img/card3.png";

const Promotional = () => {
  const promotions = [
    { id: 1, image: RiceBowl, alt: "Promotional Banner 1" },
    { id: 2, image: Card2, alt: "Promotional Banner 2" },
    { id: 3, image: Card3, alt: "Promotional Banner 3" },
  ];    
    
  return (
    <section className="bg-white py-10 md:py-15 lg:py-20">
      {/* Title Section */}
      <div className="flex w-full lg:w-1/2 font-sans-serif justify-center items-center mx-auto px-4">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#425a8b] leading-tight">
            Special Offers
          </h1>
          <p className="text-sm md:text-lg lg:text-2xl font-normal text-[#425a8b]/60 leading-tight pt-3 pb-5 md:pb-8">
            Check out our latest promotions and deals
          </p>
        </div>
      </div>

      {/* Promotional Image Cards */}
      <div className="container mx-auto px-4 mt-12 md:mt-16 lg:mt-20">
        <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
          <div className="w-full lg:w-1/4 rounded-2xl overflow-hidden shadow-[0px_0px_50px_0px_#d6d6d6] hover:shadow-[0px_0px_50px_10px_#C9C9C9] transition-all duration-300">
            <img
              src={RiceBowl}
              alt="Rice Bowl"
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>
          
          <div className="w-full lg:w-2/5 rounded-2xl overflow-hidden shadow-[0px_0px_50px_0px_#d6d6d6] -ml-4 lg:-ml-8 z-10 hover:shadow-[0px_0px_50px_10px_#C9C9C9] transition-all duration-300">
            <img
              src={Card3}
              alt="Special Offer"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
          
          <div className="w-full lg:w-1/3 rounded-2xl overflow-hidden shadow-[0px_0px_50px_0px_#d6d6d6] -ml-4 lg:-ml-6 z-20 hover:shadow-[0px_0px_50px_10px_#C9C9C9] transition-all duration-300">
            <img
              src={Card2}
              alt="Fresh Products"
              className="w-full h-56 md:h-72 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Promotional;