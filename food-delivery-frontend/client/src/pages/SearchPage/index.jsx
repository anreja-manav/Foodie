import React, { useState, useContext } from 'react';
import { MyContext } from '../../App';
import DishesResult from '../../components/SearchResults/Dishes';
import RestaurantsResult from '../../components/SearchResults/Restaurants';

const SearchPage = () => {
  const context = useContext(MyContext);
  const [activeTab, setActiveTab] = useState('dishes');

  const hasData = context?.searchData && Object.keys(context.searchData).length > 0;
  

  return (
    <div className="w-full min-h-screen flex justify-center">

      <div className="w-[60%] py-8" >
        
        <div className="flex gap-10 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`pb-3 text-sm font-bold transition-all duration-200 
              ${activeTab === 'restaurants' ? 'text-black border-b-[3px] border-[#fc8019]' : 'text-gray-400 hover:text-black'}`}
          >
            Restaurants
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`pb-3 text-sm font-bold transition-all duration-200 
              ${activeTab === 'dishes' ? 'text-black border-b-[3px] border-[#fc8019]' : 'text-gray-400 hover:text-black'}`}
          >
            Dishes
          </button>
        </div>
        
        <div className='bg-[#f1f1f6] py-3 px-5'>

        
            

            <div className="w-full">
            {hasData ? (
                activeTab === 'restaurants' ? <RestaurantsResult /> : <DishesResult />
            ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl text-gray-400 font-bold">Search for your favorite food!</h2>
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;