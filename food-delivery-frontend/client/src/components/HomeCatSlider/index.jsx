import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/free-mode';
import { Navigation, FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";

import { MyContext } from "../../App";

const HomeCatSlider = () => {
    const imgUrl = import.meta.env.VITE_API_URL;
    const context = React.useContext(MyContext);

    return (
        <>
        <div className="homeCatSlider pt-0 py-4 lg:py-8 lg:pt-4 left-6">
            <div className="container">
                <Swiper
                    slidesPerView={8}
                    spaceBetween={10}
                    navigation={context?.windowWidth < 992 ? false : true}
                    modules={[Navigation, FreeMode]}
                    freeMode={true}
                    breakpoints={{
                    300: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    550: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    900: {
                        slidesPerView: 4,
                        spaceBetween: 20
                    },
                    1100: {
                        slidesPerView: 5,
                        spaceBetween: 30
                    },
                    }}
                    className="mySwiper"
                >
                    {

                    context?.cat?.length !== 0 && context?.cat?.map((category, index) => {

                        return (

                        <SwiperSlide>
                            <Link to={"/"} className="no-underline">
                                <div className="item flex flex-col items-center justify-center group cursor-pointer">
                                    <div className="overflow-hidden w-32 h-32 mb-2">
                                        <img 
                                            src={`${imgUrl}${category.image}`} 
                                            alt={category.name} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="text-[18px] text-[#686b78] font-medium">{category.name}</h3>
                                </div>
                            </Link>
                        </SwiperSlide>

                        )
                    })

                    }
                </Swiper>
            </div>
        </div>
        </>
    );
}

export default HomeCatSlider;