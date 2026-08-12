import React, {useContext, useState} from "react";
import {
  FaBell,
  FaRegClock,
  FaStore,
  FaImage,
  FaLock,
} from "react-icons/fa";

import {MyContext} from "../../App"
import SetupRow from "../../components/SetUpRow";

const VendorDashboard = () => {

  const context = useContext(MyContext);  
  const [profileComplete] = useState(70);
  const [countProducts, setCountsProducts] = useState(0);
  const [countOrders, setCountsOrders] = useState(0);
  const vendor = context?.vendorData;
  const baseURL = import.meta.env.VITE_API_URL;

  const setupItems = [
    {
      key: "details",
      label: "Restaurant details",
      icon: FaStore,
      status: "done",
    },
    {
      key: "photos",
      label: "Logo and cover photo",
      icon: FaImage,
      status: "done",
    },
    {
      key: "products",
      label: "Add products",
      icon: FaLock,
      status: "locked",
    },
  ];
  

  return (
    <div className="min-h-screen bg-white text-[#1F2421] font-sans px-10 py-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">

        <div className="flex items-center gap-3">

          {/* User Image */}
          <img
            src={`${baseURL}${vendor?.profile_pic}`}
            alt={vendor?.name || "vendor"}
            className="h-12 w-12 rounded-full object-cover border border-gray-200"
          />

          <div>
              <p className="text-[15px] font-semibold leading-tight">
                {vendor?.name || "vendor"}
              </p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#1F2421]/45">
                Vendor dashboard
              </p>
            </div>

        </div>
        <button
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1F2421]/10 text-[#1F2421]/70 hover:bg-[#1F2421]/5"
          >
            <FaBell className="text-xl text-gray-600 cursor-pointer" />
        </button>
      </div>


      {/* Verification Alert */}
      <div className="mt-7 flex items-start gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-5 py-4">

        <FaRegClock className="mt-2 text-lg text-yellow-600" />

        <div>
          <h4 className="mb-1 text-sm font-semibold text-yellow-700">
            Verification pending
          </h4>

          <p className="text-sm leading-5 text-gray-700">
            Finish your restaurant profile so our team can review and approve
            it. Products stay locked until then.
          </p>
        </div>

      </div>


      {/* Statistics */}
      <div className="mt-10 grid grid-cols-3 gap-8">

        <div>
          <p className="text-sm text-gray-500">
            Profile
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {profileComplete}%
          </h2>
        </div>


        <div>
          <p className="text-sm text-gray-500">
            Products
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {countProducts}
          </h2>
        </div>


        <div>
          <p className="text-sm text-gray-500">
            Orders
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {countOrders}
          </h2>
        </div>

      </div>


      
      {/* Setup */}
      <div className="my-8! ">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1F2421]/45">
          Setup
        </p>

        <div className="mt-3 space-y-2!">
          {setupItems.map((item) => (
            <SetupRow key={item.key} item={item} />
          ))}
        </div>
      </div>


      {/* Complete Profile */}
      <button
        className="
          mt-10
          h-11
          w-full
          rounded-lg
          bg-gray-900
          text-base
          font-semibold
          text-white
          transition
          hover:bg-gray-800
        "
      >
        Complete profile
      </button>

    </div>
  );
};

export default VendorDashboard;