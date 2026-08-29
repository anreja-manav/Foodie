import React, {useContext, useState} from "react";
import {
  FaBell,
  FaRegClock,
  FaStore,
  FaImage,
  FaLock,
} from "react-icons/fa";
import { IoFastFood, IoArrowForwardCircle } from "react-icons/io5";


import {MyContext} from "../../App"
import SetupRow from "../SetUpRow"
import { IoIosAddCircleOutline } from "react-icons/io";

import { Link, redirect } from "react-router-dom";

const VendorNotVerifiedDashboard = () => {

  const context = useContext(MyContext);  
  

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full gap-7 text-sm md:text-xl lg:text-2xl">
        {context?.restaurantDetails === null?
        <span>
          Add restaurant details so our team will verify it.
        </span>
        :
        <span>
            Our team is verifying the details. It usally takes 2-3 business days.
          </span>} 
        <Link to = '/restaurant'>
            <button
                type="button"
                className=" bg-blue-600 text-white hover:cursor-pointer h-8 md:h-10 lg:h-15 w-40 md:w-50 lg:w-60 "
            >
                {context?.restaurantDetails === null? "Add Restaurant" : "Restaurant Details"}  
            </button>
        </Link>
    </div>
  );
};

export default VendorNotVerifiedDashboard;