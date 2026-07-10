import {useContext, useState, useEffect} from 'react';
import { MyContext } from '../../App';
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from '../../utils/api';
import { FaStar } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";




const RestaurantDetail = () => {

  const { id } = useParams();
  const [restaurantDetails, setRestaurantDetails] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [openItemDetails, setOpenItemDetails] = useState()
  const context = useContext(MyContext);
  const imgUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (id) {
      fetchDataFromApi(`/restaurants/${id}/`).then((res) => {
          setRestaurantDetails(res);
          if (res?.categories?.length) {
            const firstKey = res.categories[0]?.id ?? 0;
            setOpenCategories({ [firstKey]: true });
          }
      });
    }
  }, [id]);

  const toggleCategory = (key) => {
    setOpenCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
    
  return (
    <div className='py-5 px-2  bg-white w-[95%] md:w-[85%] lg:w-[70%] mx-auto!'>
      <span className='text-black font-[850] text-[27px] '>{restaurantDetails?.restaurant_name}</span>


      <div className="bg-linear-to-b from-gray-100 to-gray-200 p-4 rounded-[35px]">
        
        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-[30px] p-4 ">

          {/* Rating & Price */}
          <div className="flex items-center gap-2 text-[16px] font-[750]">
            <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
              <FaStar className="text-white text-sm" />
            </div>

            <span>{restaurantDetails?.rating} (162 ratings)</span>

            <span className="text-gray-400">•</span>

            <span>₹300 for two</span>
          </div>

          {/* Categories */}
          <div className="mt-6 text-orange-600 font-extrabold text-[14px]">
            {restaurantDetails.categories
            ?.slice(0, 3)
            .map(category => category.name)
            .join(", ")}
          </div>

          {/* Outlet + Delivery Time */}
          <div className="flex mt-2">
            
            {/* Timeline */}
            <div className="flex flex-col items-center mr-6 pt-3 pr-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>

              <div className="w-0.5 h-6 bg-gray-300"></div>

              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="space-y-5 pt-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[14px] text-black">
                  Outlet
                </span>

                <span className="text-gray-500 text-[14px] font-bold">
                  {restaurantDetails.city}
                </span>
              </div>

              <div className='pt-1'>
                <span className="font-extrabold text-black text-[14px]">
                  25-30 mins
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
      
      <div className='w-full pt-5'>
        <div className='flex items-center justify-center gap-1'>
          <MdOutlineRestaurantMenu /><span> Menu</span> <MdOutlineRestaurantMenu/>
        </div>

        <div className="w-full  mx-auto px-4 py-4">
          <div className="flex items-center justify-between bg-gray-200 rounded-xl px-6 py-4">
            <input
              type="text"
              placeholder="Search for dishes"
              className="w-full bg-transparent text-center text-gray-600 placeholder-gray-600 font-medium text-base outline-none"
            />
            <IoIosSearch className="w-5 h-5 text-gray-500 shrink-0 ml-3" strokeWidth={2.5} />
          </div>
        </div>

        <div className="categories">
          {restaurantDetails?.categories?.length ? (
            restaurantDetails.categories.map((category, index) => {
              const key = category.id ?? index;
              const isOpen = !!openCategories[key];
              const itemCount = category.products?.length ?? category.item_count ?? 0;

              return (
                <div key={key} className="border-b border-gray-200">

                  {/* Category header - click to expand/collapse */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(key)}
                    className="flex items-center justify-between w-full px-4 py-4 text-left"
                  >
                    <span className="text-xl font-bold text-black">
                      {category.name}
                      {itemCount ? (
                        <span>
                          ({itemCount})
                        </span>
                      ) : null}
                    </span>

                    <IoIosArrowDown
                      className={`transition-transform duration-300 ease-in-out ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* Collapsible items list */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-500 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 pb-4 space-y-4">
                      {category.products?.length ? (
                        category.products.map((item, itemIndex) => (
                          <div
                            key={item.id ?? itemIndex}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                              item.food_type === 'VEG' ? 'border-green-600' : 'border-red-600'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                item.food_type === 'VEG' ? 'bg-green-600' : 'bg-red-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-[15px] text-black">
                                {item.name}
                              </div>
                              {item.price != null && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  {item.old_price && (
                                    <span className="text-gray-400 line-through text-sm font-medium">
                                      ₹{item.old_price}
                                    </span>
                                  )}
                                  <span className="bg-indigo-600 text-white font-bold text-xs px-2 py-0.5 rounded">
                                    ₹{item.price}
                                  </span>
                                </div>
                              )}
                              {item.description && (
                                <div className="text-gray-400 text-xs mt-1 line-clamp-2">
                                  {item.description}
                                </div>
                              )}
                            </div>
                            <div className="relative self-center ">
                              {item.image && (
                                <img
                                  src={`${imgUrl}${item.image}`}
                                  alt={item.name}
                                  className="w-30 h-30 rounded-lg object-cover shrink-0 cursor-pointer"
                                  onClick={() => context.handleOpenDishDetailsModal(true, item)}
                                />
                              )}
                              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 shadow-md bg-white rounded-xl border border-gray-200 text-center flex flex-col overflow-hidden">
                                <button className="text-emerald-600 font-extrabold text-sm py-1.5 hover:bg-emerald-50 transition-colors tracking-wide">
                                  ADD
                                </button>
                                
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No items in this category</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='flex items-center justify-center'>
              <span>No products</span>
            </div>
            
          )}
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetail
