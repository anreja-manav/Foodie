import React, {useContext} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/free-mode';
import { Navigation, FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";

const CatSlider = ({SectionHeading}) => {
    const context = useContext(MyContext);
    const categories = context?.categories;
    const BaseURL = import.meta.env.VITE_API_URL;


    return (
        <section className="mb-8 pt-2">
            <SectionHeading title="Categories" />
            <Swiper
                slidesPerView={8}
                spaceBetween={10}
                navigation={context?.windowWidth < 992 ? false : true}
                modules={[Navigation, FreeMode]}
                freeMode={true}
                breakpoints={{
                300: {
                    slidesPerView: 3,
                    spaceBetween: 20
                },
                550: {
                    slidesPerView: 5,
                    spaceBetween: 20
                },
                900: {
                    slidesPerView: 6,
                    spaceBetween: 20
                },
                1100: {
                    slidesPerView: 8,
                    spaceBetween: 30
                },
                }}
                className="mySwiper"
            >

                <div className="flex flex-wrap gap-5 pt-2 pb-6">
                    {categories?.length !== 0 && categories.map((cat) => {
                        return (
                            <SwiperSlide>
                                <Link to={`/category/${cat.id}`} className="no-underline">
                                    <button
                                    key={cat.id}
                                    type="button"
                                    className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
                                    title={cat.name}
                                    >
                                    {/* Circular image container */}
                                    <div className="h-16 w-16 overflow-hidden rounded-full bg-[#232323]">
                                        <img
                                        src={`${BaseURL}${cat.image}`}
                                        alt={cat.name}
                                        className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Category name below image */}
                                    <span className="text-sm font-medium text-white text-center">
                                        {cat.name}
                                    </span>
                                    </button>
                                </Link>
                            </SwiperSlide>
                        )})}
                </div>
            </Swiper>
        </section>
    )
}   

export default CatSlider;
