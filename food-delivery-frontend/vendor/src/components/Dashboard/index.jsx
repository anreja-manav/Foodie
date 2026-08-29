import React, {useContext} from "react";
import { FiSearch, FiChevronRight, FiStar } from "react-icons/fi";
import { MyContext } from "../../App";
import NotLogin from "../notLogin";
import VendorNotVerifiedDashboard from "../VendorNotVerified";
import CatSlider from "../CatSlider";
import DishSlider from "../DishSlider";
import OrderList from "../OrderList";



function SectionHeading({ title }) {
  return (
    <div className="flex items-center justify-between py-3">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
  );
}


const Dashboard = () => {
  const context = useContext(MyContext);
  const vendor = context?.vendorData;

  if (vendor === null){
    return (
      <NotLogin />
    )
  };

  if (vendor?.vendor_profile?.is_verified === false){
    return (
      <VendorNotVerifiedDashboard />
    )

  } 
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      {/* Search bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search Restaurant, Food, Cuisine or a Dish"
          className="w-full rounded-2xl bg-[#1a1a1a] px-5 py-3 pr-12 text-sm text-gray-200 placeholder-gray-500 outline-none focus:ring-2 focus:ring-red-500/50"
        />
        <button
          type="button"
          aria-label="Search"
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#2a2a2a] text-gray-300"
        >
          <FiSearch size={16} />
        </button>
      </div>

      {/* Categories */}
      <CatSlider SectionHeading = {SectionHeading} />

      {/* Popular Dishes */}
      <DishSlider SectionHeading={SectionHeading} />

      {/* Order Reports */}
      <OrderList SectionHeading={SectionHeading} />
    </div>
  );
}

export default Dashboard;