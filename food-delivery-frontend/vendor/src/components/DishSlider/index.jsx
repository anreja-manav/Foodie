import React, {useContext} from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/free-mode';
import { Navigation, FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";

import {FiStar} from "react-icons/fi";

const DishSlider = ({SectionHeading}) => {

  const context = useContext(MyContext);
  const popularDishes = context?.popularDishes;
  const BaseURL = import.meta.env.VITE_API_URL;

  return (
    <section className="mb-8 py-3">
      <SectionHeading title="Popular Dishes" />
      <Swiper
          slidesPerView={8}
          spaceBetween={10}
          navigation={context?.windowWidth < 992 ? false : true}
          modules={[Navigation, FreeMode]}
          freeMode={true}
          breakpoints={{
          300: {
              slidesPerView: 1,
              spaceBetween: 20
          },
          550: {
              slidesPerView: 2,
              spaceBetween: 20
          },
          900: {
              slidesPerView: 3,
              spaceBetween: 20
          },
          1100: {
              slidesPerView: 4,
              spaceBetween: 30
          },
          }}
          className="mySwiper"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {popularDishes.length !== 0 && popularDishes.map((dish) => {
            return (
              <SwiperSlide>
                <div
                  key={dish.id}
                  className="rounded-2xl bg-[#1a1a1a] p-4 pt-10 text-center"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-[#232323]">
                    <Link to={`/dish/${dish.id}`} >
                      <img
                        src={`${BaseURL}${dish.image}`}
                        alt={dish.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-gray-500">Starting From</p>
                  <p className="mb-2 text-lg font-bold text-white">
                    ${dish.price}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-yellow-400">
                      <FiStar size={12} className="fill-current" />
                      {dish.rating}
                    </span>
                    <span>
                      {dish.order_count}
                      <br />
                      Total Sale
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            )})}
        </div>
      </Swiper>
    </section>
  )
}

export default DishSlider;