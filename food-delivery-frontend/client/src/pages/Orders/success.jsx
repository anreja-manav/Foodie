import React from 'react';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { TiTick } from "react-icons/ti";

const OrderComplete = () => {
    return (
  <div className="w-full min-h-[70vh] flex flex-col items-center justify-center py-10 px-4 text-center">
    <TiTick className="text-green-600 text-[90px] mb-6" />
    <h2 className="text-3xl font-bold text-green-600 mb-4">
      Order Completed Successfully
    </h2>  
    <p className="text-lg text-gray-700 mb-8">
      Thank you for your purchase! Your order has been placed successfully.
    </p>
    <Link to="/">
      <Button 
        variant="contained" 
        className="btn-org btn-lg px-6 py-3"
      >
        Go Back to Home
      </Button>
    </Link>
  </div>
);

};
export default OrderComplete;
