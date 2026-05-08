import React, {useContext, useState, useEffect} from 'react'
import { MyContext } from "../../App";
import { fetchDataFromApi } from '../../utils/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { Link } from 'react-router-dom';

import { Navigation, FreeMode } from 'swiper/modules';



const Restaurants = () => {
    const imgUrl = import.meta.env.VITE_API_URL;
    const context = useContext(MyContext);
    
    

  return (
    <section className='restaurantsSlider py-5'>
      <div className='container'>
        {context?.restaurants?.length !== 0 ? (
          <>
            <h2 className="font-bold text-[23px] text-black mt-1 pl-3 py-3 pb-8">
              Top restaurant chains in {context?.formFields.city}
            </h2>

            <Swiper
              slidesPerView={3.1}
              spaceBetween={10}
              navigation={true}
              modules={[Navigation, FreeMode]}
              freeMode={true}
              breakpoints={{
                250: { slidesPerView: 1, spaceBetween: 10 },
                330: { slidesPerView: 2, spaceBetween: 10 },
                500: { slidesPerView: 2, spaceBetween: 10 },
                1100: { slidesPerView: 3.1, spaceBetween: 10 },
              }}
              className="mySwiper"
            >
              {context?.restaurants?.map((restaurant, index) => (
                <SwiperSlide>
                  <div className="rounded-md overflow-hidden flex flex-col h-full transform transition duration-300 hover:scale-95">
                    <div className='group imgWrapper w-90 overflow-hidden rounded-md relative'>
                        <Link to={`/restaurants/${restaurant.id}`}>
                            <div className='img h-45 sm:h-50 overflow-hidden rounded-2xl'>
                                <img src={`${imgUrl}${restaurant.resturant_pic}`} alt="" className='w-full' />
                            </div>
                            
                        </Link>
                        
                    </div>
                    <div className="info">
                      <h3 className='font-bold text-2xl'>{restaurant.restaurant_name}</h3>
                      <p className="font-medium text-gray-700 text-xl">{restaurant.restaurant_description?.slice(0,30)}...</p>
                      <p className="font-medium text-gray-700 text-xl">{restaurant.restaurant_address}</p>
                    </div>

                    

                    </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <img src="EmptyRestaurant.png" className='w-100' alt="Empty" />
            <h2 className='text-center font-bold text-black lg:text-[25px] md:text-[20px]'>
                No restaurants available in your city yet.
            </h2>
            <p className='text-center font-xl text-gray-600 lg:text-[20px] md:text-[18px] sm:text-[10px]'>
                We're working on adding amazing restaurants to your area. Please check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
    

}

export default Restaurants
