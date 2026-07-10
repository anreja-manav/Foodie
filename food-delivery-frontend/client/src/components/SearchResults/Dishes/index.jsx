import React from 'react';
import { MyContext } from '../../../App';
import { IoIosStar } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';



const DishesResult = () => {
  const context = React.useContext(MyContext);
  const products = context?.searchData?.products;
  const imgUrl = import.meta.env.VITE_API_URL;

  const filters = ["Fast Delivery", "Veg", "Rated 4+", "Rs 250+", "Rs 100-Rs 250", "Gourmet"];

  return (
    <div className="dishes-container max-w-7xl mx-auto px-4">
      {products && products.length > 0 ? (
        <>
          {/* Horizontal Filters Scroll */}
          <div className="flex items-center gap-3 py-6 overflow-x-auto no-scrollbar">
            {filters.map((filter, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap shadow-sm hover:shadow-md transition-shadow"
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Cards Grid Wrapper */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
            {products.map((dish) => (
              <div 
                key={dish.id || dish.name} 
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 w-full flex flex-col gap-4 font-sans"
              >
                {/* 1. RESTAURANT HEADER */}
                <Link to={`/restaurants/${dish.restaurant_id}`}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-900 font-bold text-sm tracking-wide">
                      By { dish.restaurant || "Restaurant"}
                    </span>
                    
                    {/* Rating & Delivery Time */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <IoIosStar className="w-3.5 h-3.5 fill-gray-600 stroke-gray-600" />
                      <span className="text-gray-700 font-bold">{dish.restaurant_rating}</span>
                      <span>({dish.restaurant_rating_count || "1K+"})</span>
                      <span className="mx-0.5">•</span>
                      <span>{dish.preparation_time}- {dish.preparation_time + 5} MINS</span>
                    </div>

                    {/* Tag / Offer */}
                    <div className="flex items-center gap-1 mt-1 text-orange-600 font-extrabold text-[11px] tracking-wide uppercase">
                      <span>Offer</span>
                      <span>{dish.savings_percentage ? `${dish.savings_percentage}% OFF` : "OFFER AVAILABLE"}</span>
                    </div>
                  </div>

                  {/* Action arrow */}
                  <button className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
                    <FaArrowRight className="w-5 h-5 stroke-[1.5]" />
                  </button>
                </div>
                </Link>

                {/* DIVIDER */}
                <hr className="border-t border-dashed border-gray-200 -mx-5" />

                {/* 2. PRODUCT INFO AREA */}
                <div className="flex justify-between gap-4 items-stretch">
                  
                  {/* Left Side: Product Details */}
                  <div className="flex flex-col flex-1 justify-between py-1">
                    <div className="flex flex-col gap-1">
                      {/* Food Type Indicator (Veg/Non-Veg icon wrapper) */}
                      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        dish.food_type === 'VEG' ? 'border-green-600' : 'border-red-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          dish.food_type === 'VEG' ? 'bg-green-600' : 'bg-red-600'
                        }`} />
                      </div>

                      {/* Product Name */}
                      <h3 className="text-gray-800 font-extrabold text-lg leading-snug mt-1">
                        {dish.name}
                      </h3>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 mt-0.5">
                        {dish.old_price && (
                          <span className="text-gray-400 line-through text-sm font-medium">
                            ₹{dish.old_price}
                          </span>
                        )}
                        <span className="bg-indigo-600 text-white font-bold text-xs px-2 py-0.5 rounded">
                          ₹{dish.price}
                        </span>
                      </div>
                    </div>

                    {/* More Details Button */}
                    <button 
                      className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-600 font-semibold w-max mt-4 hover:bg-gray-50 transition-colors"
                      onClick={() => context.handleOpenDishDetailsModal(true, dish)}
                    >
                      More Details
                      <span className="text-[16px]"><MdKeyboardArrowRight /></span>
                    </button>
                  </div>

                  {/* Right Side: Product Image & Add Button */}
                  <div className="relative w-28 h-28 shrink-0 self-center">
                    <img
                      src={`${imgUrl}${dish.image}`}
                      alt={dish.name}
                      className="w-full h-full object-cover rounded-2xl bg-orange-50"
                    />
                    
                    {/* ADD Button container floating on image */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 shadow-md bg-white rounded-xl border border-gray-200 text-center flex flex-col overflow-hidden">
                      <button className="text-emerald-600 font-extrabold text-sm py-1.5 hover:bg-emerald-50 transition-colors tracking-wide">
                        ADD
                      </button>
                      
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl text-gray-400 font-bold">No dishes matches your search!</h2>
        </div>
      )}
    </div>
  );
};

export default DishesResult;