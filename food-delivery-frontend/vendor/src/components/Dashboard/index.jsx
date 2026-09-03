import React, { useContext, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MyContext } from "../../App";

import NotLogin from "../notLogin";
import VendorNotVerifiedDashboard from "../VendorNotVerified";
import CatSlider from "../CatSlider";
import DishSlider from "../DishSlider";
import OrderList from "../OrderList";
import OrderDetails from "../OrderDetails";
import SectionHeading from "../SectionHeading";



const Dashboard = () => {
  const context = useContext(MyContext);

  const vendor = context?.vendorData;

  const [selectedOrder, setSelectedOrder] = useState(null);


  if (vendor === null) {
    return <NotLogin />;
  }


  if (vendor?.vendor_profile?.is_verified === false) {
    return <VendorNotVerifiedDashboard />;
  }


  const isOrderDetailsOpen = selectedOrder !== null;


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

          ${
            isOrderDetailsOpen
              ? "pr-[410px]"
              : ""
          }
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


        {/* POPULAR DISHES */}

        <DishSlider
          SectionHeading={SectionHeading}
        />


        
        {/*ORDER REPORTS */}

        <OrderList
          SectionHeading={SectionHeading}
          selectedOrder={selectedOrder}
          onSelectOrder={setSelectedOrder}
        />

      </div>


      {/*ORDER DETAILS */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
        />
      )}

    </div>
  );
};


export default Dashboard;