import { useContext } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { MyContext } from "../../context/MyContext";



const CatSlider = () => {
  const context = useContext(MyContext);

  const categories = Array.isArray(context?.categories) ? context.categories : [];
  const BaseURL = (import.meta.env.VITE_API_URL || "")

  if (categories.length === 0) return null;

  return (
    <section className="mb-8 pt-2">
      <h2 className="mb-4 text-xl font-semibold text-white">Categories</h2>

      <Swiper
        slidesPerView={8}
        spaceBetween={10}
        navigation={(context?.windowWidth ?? 0) >= 992}
        modules={[Navigation, FreeMode]}
        freeMode={true}
        breakpoints={{
          300: { slidesPerView: 3, spaceBetween: 20 },
          550: { slidesPerView: 5, spaceBetween: 20 },
          900: { slidesPerView: 6, spaceBetween: 20 },
          1100: { slidesPerView: 8, spaceBetween: 30 },
        }}
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat.id}>
            <Link to={`/category/${cat.id}`}>
              <div className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-[#232323]">
                  <img
                    src={
                      cat.image?.startsWith("http")
                        ? cat.image
                        : `${BaseURL}${cat.image?.startsWith("/") ? "" : "/"}${cat.image ?? ""}`
                    }
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-white">{cat.name}</span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CatSlider;