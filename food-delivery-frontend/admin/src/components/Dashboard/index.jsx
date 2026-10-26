import React, { useContext, useState } from "react";
import { FiSearch } from "react-icons/fi";


import NotLogin from "../notLogin";
import CatSlider from "../CatSlider";
import SectionHeading from "../SectionHeading";
import { MyContext } from "../../context/MyContext";



const Dashboard = ({admin}) => {
  const context = useContext(MyContext);

  if (context?.authLoading) {
    return <div className="flex h-full flex-1 items-center justify-center text-gray-400">Loading...</div>;
  }
if (admin === null) return <NotLogin />;

  if (admin === null) {
    return <NotLogin />;
  }


  return (
    <div className="relative flex h-full min-w-0 flex-1 overflow-hidden bg-[#0d0d0d]">

      {/* DASHBOARD CONTENT */}

      <div
        className={`
          h-full
          min-w-0
          overflow-y-auto

          px-8
          py-6

          transition-all
          duration-300
        `}
      >

        {/* =====================================================
            SEARCH
            ===================================================== */}

        <div className="relative mb-8">

          <input
            type="text"
            placeholder="Search Restaurant, Food, Cuisine or a Dish"
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-[#1a1a1a]
              px-5
              py-3
              pr-12
              text-sm
              text-gray-200
              placeholder-gray-500
              outline-none

              focus:border-red-500/40
              focus:ring-2
              focus:ring-red-500/20
            "
          />

          <button
            type="button"
            aria-label="Search"
            className="
              absolute
              right-2
              top-1/2

              flex
              h-9
              w-9

              -translate-y-1/2

              items-center
              justify-center

              rounded-full

              bg-[#2a2a2a]

              text-gray-300

              transition

              hover:bg-[#333]
            "
          >
            <FiSearch size={16} />
          </button>

        </div>


        {/* CATEGORIES */}

        <CatSlider
          SectionHeading={SectionHeading}
        />

      </div>


    </div>
  );
};


export default Dashboard;