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
                            <Link to={"/"}>
                            <div className="item p-3 bg-white rounded-2xl text-center flex items-center justify-center flex-col m-0">
                                <img src={`${imgUrl}${category.image}`} alt={category.name} className="w-30 h-30 py-2 transition-transform duration-500 transform-3d hover:rotate-y-12 hover:rotate-x-12 rounded-lg"/>
                                <h3 className="text-xl">{category.name}</h3>
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