import { fetchDataFromApi } from "../../utils/api";
import React, { useState, useContext, useEffect, useRef } from 'react';
import { MyContext } from "../../App";
import Button from "@mui/material/Button";

const RestaurantDetailsForm = () => {
  const context = useContext(MyContext);
  const restaurant = context?.restaurantDetails;
  const [formFields, setFormFields] = useState({
    restaurant_name: '',
    restaurant_address: '',
    city: '',
    pincode: '',
    contact_number: '',
    restaurant_description: '',
    GST_number: '',
    Account_number: '',
    is_open: true,
    opening_time: "09:00",
    closing_time: "22:00",
  });
  const [fssaiFile, setFssaiFile] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const fssaiInputRef = useRef(null);
  const BaseURL = import.meta.env.VITE_API_URL;

  return (
    <div className="py-2">
      {context.restaurantDetails !== null ?
        <>
          <div className="grid grid-cols-3 h-20 items-center px-6  text-black">
            <div></div> 
            
            <h1 className="text-center text-2xl font-bold">Restaurant Details</h1>
            
            <div className="flex justify-end">
              <Button 
                variant="outlined" 
                className="font-medium px-4 py-2 transition-colors duration-200"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  borderRadius: '0px',
                  borderWidth: '2px',
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: '#2563eb',
                    borderColor: 'white',
                    borderWidth: '2px',
                  }
                }}
              >
                Edit
              </Button>
            </div>
          </div>

          <div className="min-h-screen min-w-80% flex flex-col justify-center items-center px-10 py-8 bg-white">
            <img src={`${BaseURL}${restaurant?.resturant_pic}`} alt={restaurant.restaurant_name} />
          </div>
        </>
      :
        <div className="min-h-screen px-10 py-8">
          <h1>Add Restaurant</h1>
        </div>  
      }
    </div>
  );
};

export default RestaurantDetailsForm;
