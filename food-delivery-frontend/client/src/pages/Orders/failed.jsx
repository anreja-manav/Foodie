import React from 'react';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { IoMdCloseCircle } from "react-icons/io";

const OrderFailed = () => {
  return (
  <div className="w-full min-h-[70vh] flex flex-col items-center justify-center py-10 px-4 text-center">
    
    <IoMdCloseCircle className="text-red-600 text-[80px] mb-6" />

    <h2 className="text-3xl font-bold text-red-600 mb-4">
      Order Failed
    </h2>

    <p className="text-lg text-gray-700 mb-2">
      Unfortunately, your order could not be processed at this time.
    </p>

    <p className="text-lg text-gray-700 mb-6">
      Please try again later or contact our support team for assistance.
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

export default OrderFailed;