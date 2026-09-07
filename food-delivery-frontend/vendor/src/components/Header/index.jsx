import React, { useContext } from "react";
import { MyContext } from "../../App";
import { editData } from "../../utils/api";
import Switch from "@mui/material/Switch";


const Header = () => {

  const context = useContext(MyContext);
  const restaurant = context?.restaurantDetails;
  const BaseURL = import.meta.env.VITE_API_URL;

  const toggleOpenClosed = (state) => {
      editData(`restaurants/update/${restaurant.id}/`,{'is_open':state} ).then((res) => {
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


  return (
    <>
      <header className= "w-full bg-[#0d0d0d] ">
        {restaurant ?
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
          :
          <></>
          }
      </header>
    </>
  );
};

export default Header;