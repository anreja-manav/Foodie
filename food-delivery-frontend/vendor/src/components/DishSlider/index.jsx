import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

import { Navigation, FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import { FiStar } from "react-icons/fi";

import { MyContext } from "../../App";

const DishSlider = ({ SectionHeading }) => {
  const context = useContext(MyContext);

  const popularDishes = context?.popularDishes || [];
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
            spaceBetween: 20,
          },

          550: {
            slidesPerView: 2,
            spaceBetween: 20,
          },

          900: {
            slidesPerView: 3,
            spaceBetween: 20,
          },

          1100: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        className="mySwiper"
      >

        {popularDishes.length > 0 ? (
          popularDishes.map((dish) => (
            <SwiperSlide key={dish.id}>

              <div
                className="
                  rounded-2xl
                  bg-[#1a1a1a]
                  p-4
                  pt-10
                  text-center
                "
              >

                {/* Image */}
                <div className="mx-auto mb-3 h-16 w-16 overflow-hidden rounded-full bg-[#232323]">

                  <Link to={`/dish/${dish.id}`}>
                    <img
                      src={`${BaseURL}${dish.image}`}
                      alt={dish.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                </div>

                {/* Name */}
                <h3 className="truncate text-base font-semibold text-white">
                  {dish.name}
                </h3>

                <p className="text-xs text-gray-500">
                  Starting From
                </p>

                {/* Price */}
                <p className="mb-2 text-lg font-bold text-white">
                  ₹{dish.price}
                </p>

                {/* Rating + Sales */}
                <div className="flex items-center justify-between text-xs text-gray-400">

                  <span className="flex items-center gap-1 text-yellow-400">
                    <FiStar
                      size={12}
                      className="fill-current"
                    />

                    {dish.rating}
                  </span>

                  <span className="text-right">
                    {dish.order_count}
                    <br />
                    Total Sale
                  </span>

                </div>

              </div>

            </SwiperSlide>
          ))
        ) : (
          <div className="py-10 text-center text-sm text-gray-500">
            No popular dishes available.
          </div>
        )}

      </Swiper>

    </section>
  );
};

export default DishSlider;