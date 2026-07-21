import React,{useState, useContext} from 'react';
import { Link } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GoTriangleDown } from "react-icons/go";
import Rating from '@mui/material/Rating';
import { IoCloseSharp } from "react-icons/io5";
import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
import {MyContext} from "../../App"

const CartItems = (props) => {
    const [qtyAnchorEl, setQtyAnchorEl] = useState(null);
    const openQty = Boolean(qtyAnchorEl);

    const [selectedQty, setSelectedQty] = useState(props?.item?.quantity);
    const context = useContext(MyContext);
    const imgUrl = import.meta.env.VITE_API_URL;

    const dish = props?.item?.dish

    const handleQtyChange = async (value) => {
        setQtyAnchorEl(null);
        setSelectedQty(value);

        const cartObj = {
        product: dish.id,
        quantity: value,
        };

        const res = await editData("/cart/update_item", cartObj);

        if (res?.error === false) {
            context?.alertBox("success", res?.message);
            context?.getCartItems();
        } else {
            context?.alertBox("error", res?.message);
        }
    };

    const removeItem = (id) => {
      deleteData(`/cart/remove_item/${id}`).then((res) => {
        if (res?.error === false) {
            context?.alertBox("success", res?.message);
            context?.getCartItems();
        } else {
            context?.alertBox("error", res?.message);
        }
      });
    };

    return (
    <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)]">

      {/* Image */}
      <div className="img w-[30%] sm:w-[20%] lg:w-[15%] rounded-md overflow-hidden">
          <img
            src={`${imgUrl}${dish?.image}`}
            alt={dish?.name}
            className="w-full group-hover:scale-105 transition-all"
            onClick={() => context.handleOpenDishDetailsModal(true, dish)}
          />
      </div>

      <div className="info w-[70%] sm:w-[80%] lg:w-[85%] relative">

        <IoCloseSharp
          className="cursor-pointer absolute top-0 right-0 text-[22px] link transition-all"
          onClick={() => removeItem(dish?.id)}
        />

        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
          dish?.food_type === 'VEG' ? 'border-green-600' : 'border-red-600'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${
            dish?.food_type === 'VEG' ? 'bg-green-600' : 'bg-red-600'
          }`} />
        </div>
        <h3 className="text-[13px] sm:text-[15px] w-[80%]">
          {dish?.name}
        </h3>

        

        {/* Variant & Qty */}
        <div className="flex items-center gap-4 mt-2 flex-wrap pb-3">

          {/* Quantity */}
          <div className="relative">
            <span
              className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-semibold py-1 px-2 rounded-md cursor-pointer"
              onClick={(e) => setQtyAnchorEl(e.currentTarget)}
            >
              Quantity: {selectedQty} <GoTriangleDown />
            </span>

            <Menu
              anchorEl={qtyAnchorEl}
              open={openQty}
              onClose={() => setQtyAnchorEl(null)}
            >
              {Array.from({ length: 15 }).map((_, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleQtyChange(index + 1)}
                >
                  {index + 1}
                </MenuItem>
              ))}
            </Menu>
          </div>

        </div>
        {/* Price */}
        <div className="flex items-center gap-4 mt-2">
          <span className="oldPrice line-through text-gray-500 text-[14px] font-medium">
            &#x20b9;{dish?.old_price}
          </span>

          <span className="bg-indigo-600 text-white px-2 py-0.5 rounded price text-[14px] font-semibold">
            &#x20b9;{dish?.price}
          </span>

          {/* <span className="price text-orange-500 text-[14px] font-semibold">
            {dish?.savings_percentage}%
          </span> */}

          
        </div>

      </div>
    </div>
  );
};

export default CartItems;