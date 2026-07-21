import React, { useState, useEffect, useContext } from "react";
import Button from '@mui/material/Button';
import { BsFillBagCheckFill } from "react-icons/bs";
import CartItems from "../Cart/cartItems";
import { MyContext } from "../../App"
import { fetchDataFromApi } from "../../utils/api";
import { Link } from "react-router-dom";

const CartPage = () => {
    const context = useContext(MyContext);
    
    return (
    <section className="section py-4 lg:py-8 pb-10">
      <div className="container w-[80%] max-w-[80%] flex gap-5 flex-col lg:flex-row">
        <div className="leftpart w-full lg:w-[70%]">

          <div className="shadow-md rounded-md bg-white">
            <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2 className="font-bold ">Your Cart</h2>
              <p className='mt-0'>
                There are <span className='font-bold text-orange-500'>{context?.cartData?.length}</span> dishes in your cart
              </p>
            </div>
            {
              context?.cartData?.length !== 0 ? context?.cartData?.map((item, index) => {
                return (
                  <CartItems 
                    key={index}
                    item={item}
                    quantity={item?.quantity}
                  />
                )
              })

                :
                <>
                  <div className="flex items-center justify-center flex-col py-10 gap-5">
                    <img src='/emptyCart.png' className='w-[150px]' />
                    <h4 className='font-semibold'>Your Cart is Currently Empty</h4>
                    <Link to="/">
                      <Button className='btn-org font-medium!'>Continue Shopping</Button>
                    </Link>
                  </div>
                </>
            }

          </div>
        </div>

        <div className="rightpart w-full lg:w-[30%]">
          <div className="shadow-md rounded-md bg-white p-5 lg:sticky lg:top-[155px] lg:z-[10]">
            <h3 className="pb-3">Cart Totals</h3>
            <hr />

            <p className="flex items-center justify-between">
              <span className="text-[14px] font-medium">Subtotal</span>
              <span className="text-primary font-bold">
                {
                  (context?.cartData.length !== 0 ?
                    context.cartData.map(item => parseInt(item.dish.price) * item.quantity)
                      .reduce((total, value) => total + value, 0) : 0)
                    ?.toLocaleString('en-us', { style: 'currency', currency: 'INR' })

                }
              </span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-[14px] font-medium">Shipping</span>
              <span className="font-bold">Free</span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-[14px] font-medium">Estimate for</span>
              <span className="font-bold">{context?.formFields.city}</span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-[14px] font-medium">Total</span>
              <span className="text-primary font-bold">
                {
                  (context?.cartData.length !== 0 ?
                    context.cartData.map(item => parseInt(item.dish.price) * item.quantity)
                      .reduce((total, value) => total + value, 0) : 0)
                    ?.toLocaleString('en-us', { style: 'currency', currency: 'INR' })

                }
              </span>
            </p>

            <br />
            <Link to="/checkout">
            <Button className="btn-org btn-l w-full flex gap-2">
              <BsFillBagCheckFill className="text-[20px]" />Checkout
            </Button>
            </Link>


          </div>
        </div>


      </div>
    </section>
  );
}

export default CartPage;