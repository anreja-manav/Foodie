import React from 'react';
import { MyContext } from '../../../App';
import { Link } from 'react-router-dom';

const RestaurantsResult = () => {
  const context = React.useContext(MyContext);
  const imgUrl = import.meta.env.VITE_API_URL;
  const restaurants = context?.searchData?.restaurants;

  return (
    <div className="restaurants-container py-6">
      {restaurants && restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 px-4 max-w-6xl mx-auto">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="flex items-start h-30 md:h-35 gap-5 p-2 pb-5 w-70 md:w-85 bg-white transition duration-200 hover:scale-[0.98] cursor-pointer"
            >
              {/* Image & Badge Container */}
              <div className="relative shrink-0 w-20 h-20 md:w-25 md:h-25 rounded-2xl overflow-hidden shadow-sm">
                <Link to={`/restaurants/${restaurant.id}`}>
                  <img 
                    src={`${imgUrl}${restaurant.resturant_pic}`} 
                    alt={restaurant.restaurant_name} 
                    className="w-full h-full object-cover" 
                  />
                </Link>
              </div>
              
              {/* Info Container */}
              <div className="flex flex-col grow py-3">
                {/* Title */}
                <h3 className="font-bold text-slate-800 text-lg tracking-tight leading-snug transition">
                  {restaurant.restaurant_name}
                </h3>
                
                

                {/* Taglines / Categories */}
                <p className="text-sm text-gray-500 font-medium line-clamp-1">
                  {restaurant.restaurant_description}
                </p>

                {/* Location */}
                <p className="text-sm text-gray-400 font-normal ">
                  {restaurant.restaurant_address }
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">No Restaurant found matching your search.</p>
      )}
    </div>
  );
};

export default RestaurantsResult;