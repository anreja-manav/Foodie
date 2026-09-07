import React, { useContext } from 'react';
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { FiArrowUpRight, FiEdit2 } from "react-icons/fi";
import NotLogin from '../../components/notLogin';
import VendorNotVerifiedDashboard from '../../components/VendorNotVerified';
import { editData } from '../../utils/api';
import OrderList from '../../components/OrderList';
import DishSlider from '../../components/DishSlider';
import SectionHeading from '../../components/SectionHeading';

const RestaurantDetails = () => {
  const context = useContext(MyContext);
  const vendor = context?.vendorData;
  const restaurant = context?.restaurantDetails;
  const orders = context?.orders || [];
  const dishes = context?.dishes || [];

  const BaseURL = import.meta.env.VITE_API_URL;

  const pendingOrders = orders.filter(
    (o) => o.order_status !== "DELIVERED" && o.order_status !== "CANCELLED"
  ).length;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const revenueThisMonth = orders
    .filter((o) => {
      const orderDate = new Date(o.created_at);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, o) => sum + (Number(o.total_ammount) || 0), 0);

  const toggleOpenClosed = (state) => {
    editData(`restaurants/update/${restaurant?.id}/`,{'is_open':state} ).then((res) => {
      if (res?.error === false){
        if (state === false){
          context?.alertBox("success", "Restaurant Closed");
        }else{
          context?.alertBox("success", "Restaurant is now Open");
        }
        context?.getRestaurantDetails();
      }else{
        context?.alertBox("error", res?.message || "Something went wrong");
      }
    })
  };

  // Authentication & Verification guards
  if (vendor === null) {
    return <NotLogin />;
  }

  if (vendor?.vendor_profile?.is_verified === false) {
    return <VendorNotVerifiedDashboard />;
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-[#0d0d0d] px-8 py-6">
      {restaurant ? (
        <>
          {/* Restaurant status banner */}
          <div className="rounded-2xl bg-[#1a1a1a] border border-white/10 p-6 lg:flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-5">
              <img
                src={`${BaseURL}${restaurant?.resturant_pic}`}
                alt={restaurant?.restaurant_name}
                className="h-15 w-15 rounded-full object-cover shrink-0"
              />
              <h1 className="text-[12px] sm:text-[18px] lg:text-[22px] font-bold text-white uppercase tracking-wide">
                {restaurant?.restaurant_name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wide text-gray-400">
                RESTAURANT STATUS
              </span>
              <span className={`text-sm font-bold ${restaurant?.is_open ? "text-green-500" : "text-gray-500"}`}>
                OPEN
              </span>
              <Switch
                checked={!restaurant?.is_open}
                onChange={() => toggleOpenClosed(!restaurant?.is_open)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#ef4444' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#ef4444' },
                  '& .MuiSwitch-track': { backgroundColor: '#3a3a3a' },
                }}
              />
              <span className={`text-sm font-bold ${!restaurant?.is_open ? "text-red-500" : "text-gray-500"}`}>
                CLOSED
              </span>
            </div>
          </div>

          {/* Info row */}
          <div className="mt-6 flex items-center justify-between py-4">
            <div>
              <h2 className="text-lg font-bold text-white uppercase">
                {restaurant?.restaurant_name} {restaurant?.city ? `(${restaurant.city})` : ""}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Address: {restaurant?.restaurant_address}
                {restaurant?.pincode ? `, ${restaurant.pincode}` : ""}
                {" | "}Contact: {restaurant?.contact_number}
                {" | "}Operating: {restaurant?.opening_time} - {restaurant?.closing_time}
              </p>
            </div>

            <Link to="/restaurant/edit">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#ef4444',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  '&:hover': { backgroundColor: '#dc2626' },
                }}
              >
                Manage Menu
              </Button>
            </Link>
          </div>

          {/* Stat cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-6">

            {/* Total Orders */}
            <div className="rounded-2xl bg-[#1a1a1a] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold tracking-wide text-gray-400">
                  TOTAL ORDERS
                </span>
                <Link to="/orders" className="text-xs font-semibold text-red-500 hover:text-red-400">
                  View All
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-white">{orders.length}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/15 text-green-500">
                  <FiArrowUpRight size={16} />
                </span>
              </div>
            </div>

            {/* Total Products */}
            <div className="rounded-2xl bg-[#1a1a1a] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold tracking-wide text-gray-400">
                  TOTAL PRODUCTS
                </span>
                <Link to="/restaurant/edit" className="text-xs font-semibold text-red-500 hover:text-red-400">
                  Manage Menu
                </Link>
              </div>
              <span className="text-3xl font-bold text-white">{dishes.length}</span>
            </div>

            {/* Revenue this month */}
            <div className="rounded-2xl bg-[#1a1a1a] border border-white/10 p-5">
              <div className="mb-4">
                <span className="text-xs font-semibold tracking-wide text-gray-400">
                  REVENUE THIS MONTH
                </span>
              </div>
              <span className="text-3xl font-bold text-white">
                ₹{revenueThisMonth.toFixed(2)}
              </span>
            </div>

            {/* Pending orders */}
            <div className="rounded-2xl bg-[#1a1a1a] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold tracking-wide text-gray-400">
                  PENDING ORDERS
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-white">{pendingOrders}</span>
                <Link to="/orders">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: '#292929',
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#333' },
                    }}
                  >
                    Go to Orders
                  </Button>
                </Link>
              </div>
            </div>

          </div>

          {/* Restaurant Details */}
          <div className="relative mt-6 rounded-2xl bg-[#1a1a1a] border border-white/10 p-6 py-7">

            <Link to="/restaurant/form" className="absolute right-6 top-6">
              <Button
                variant="outlined"
                startIcon={<FiEdit2 size={14} />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.5,
                  '&:hover': {
                    backgroundColor: '#ef4444',
                    borderColor: '#ef4444',
                  },
                }}
              >
                Edit
              </Button>
            </Link>

            <h3 className="text-base font-bold text-white uppercase tracking-wide pb-5">
              Restaurant Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">

              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase">
                  Restaurant Name
                </span>
                <span className="text-sm text-gray-200">
                  {restaurant?.restaurant_name || "—"}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase">
                  Contact Number
                </span>
                <span className="text-sm text-gray-200">
                  {restaurant?.contact_number || "—"}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase">
                  City
                </span>
                <span className="text-sm text-gray-200">
                  {restaurant?.city || "—"}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase">
                  Address
                </span>
                <span className="text-sm text-gray-200">
                  {restaurant?.restaurant_address || "—"}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase">
                  Pincode
                </span>
                <span className="text-sm text-gray-200">
                  {restaurant?.pincode || "—"}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase">
                  Operating Hours
                </span>
                <span className="text-sm text-gray-200">
                  {restaurant?.opening_time} - {restaurant?.closing_time}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase">
                  GST Number
                </span>
                <span className="text-sm text-gray-200">
                  {restaurant?.GST_number || "—"}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase">
                  Description
                </span>
                <span className="text-sm text-gray-200">
                  {restaurant?.restaurant_description || "—"}
                </span>
              </div>

            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center gap-4">
          <h1 className="text-2xl font-bold text-white pb-2">Add Restaurant</h1>
          <p className="text-gray-400 text-sm">
            You haven't added your restaurant details yet.
          </p>
          <Link to="/restaurant/form">
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ef4444',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { backgroundColor: '#dc2626' },
              }}
            >
              Add Restaurant
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;