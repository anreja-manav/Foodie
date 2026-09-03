import React, { useState } from "react";
import {
  FiMapPin,
  FiClock,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";

const TABS = [
  "Delivery",
  "Dine In",
  "Takeaway",
];

const OrderDetails = ({ order, onBack }) => {
  const [tab, setTab] = useState("Delivery");

  const BaseURL = import.meta.env.VITE_API_URL;

  if (!order) {
    return null;
  }

  const items = order?.items || [];

  return (
    <aside
      className="
        fixed
        right-0
        top-0
        z-50

        flex
        h-screen
        w-[380px]

        flex-col
        overflow-y-auto

        bg-[#3a3a3a]

        p-5

        shadow-2xl
      "
    >

      {/* Close Button */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Close order details"
        className="
          absolute
          right-5
          top-5

          flex
          h-8
          w-8

          items-center
          justify-center

          rounded-full

          bg-[#181818]

          text-gray-400

          shadow-lg

          transition

          hover:bg-black
          hover:text-white
        "
      >
        <FiX size={15} />
      </button>


      {/* Delivery Address */}
      <div className="rounded-2xl bg-[#555555] p-5 text-white">

        <h3 className="mb-4 text-sm font-bold tracking-wide">
          DELIVERY ADDRESS
        </h3>

        <p className="mb-3 flex items-start gap-2 text-sm text-gray-300">

          <FiMapPin
            size={14}
            className="mt-0.5 shrink-0"
          />

          <span>
            {order.user_name},{" "}
            {order.address},{" "}
            {order.city},{" "}
            {order.pincode}
          </span>

        </p>

        <p className="flex items-center gap-2 text-sm text-gray-300">
          <FiClock size={14} />
          20 min
        </p>

      </div>


      {/* Cart */}
      <div className="mt-6">

        {/* Cart Header */}
        <div className="mb-4 flex items-center justify-between">

          <h3 className="flex items-center gap-2 text-base font-semibold text-white">
            <FiShoppingCart size={17} />
            Cart
          </h3>

          <span className="text-xs text-gray-500">
            Order ID: #{order.id}
          </span>

        </div>


        {/* Tabs */}
        <div
          className="
            flex
            items-center
            rounded-full
            border
            border-white/20
            bg-[#292929]
            p-1
          "
        >

          {TABS.map((t) => (

            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`
                flex-1
                rounded-full
                py-2
                text-xs
                font-semibold
                transition-all

                ${
                  tab === t
                    ? "bg-red-500 text-white shadow"
                    : "text-gray-400 hover:text-white"
                }
              `}
            >
              {t}
            </button>

          ))}

        </div>


        {/* Items */}
        <div className="mt-4">

          {items.length > 0 ? (

            items.map((item, index) => (

              <div
                key={item?.product || index}
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-white/10
                  py-4
                "
              >

                {/* Image */}
                <div
                  className="
                    h-[52px]
                    w-[52px]
                    shrink-0
                    overflow-hidden
                    rounded-full
                    bg-[#292929]
                  "
                >
                  <img
                    src={`${BaseURL}${item?.image}`}
                    alt={item?.name}
                    className="h-full w-full object-cover"
                  />
                </div>


                {/* Information */}
                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-semibold text-white">
                    {item?.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Quantity: {item?.quantity}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Price: {item?.price}
                  </p>


                </div>


                

              </div>

            ))

          ) : (

            <p className="py-8 text-center text-sm text-gray-500">
              No items in this order.
            </p>

          )}

        </div>

      </div>


      {/* Divider */}
      <div className="mt-5 border-t border-dashed border-white/20" />


      {/* Totals */}
      <div className="mt-6 flex flex-col gap-3">

        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">

          <span className="text-gray-400">
            Sub Total
          </span>

          <span className="text-gray-200">
            ₹{order?.total_ammount}
          </span>

        </div>


        {/* Delivery */}
        <div className="flex items-center justify-between text-sm">

          <span className="text-gray-400">
            Delivery Charge
          </span>

          <span className="text-gray-200">
            Free
          </span>

        </div>


        {/* Total */}
        <div className="mt-2 flex items-center justify-between">

          <span className="text-base font-bold text-white">
            TOTAL
          </span>

          <span className="text-base font-bold text-white">
            ₹{order?.total_ammount}
          </span>

        </div>

      </div>


      {/* Confirm Order */}
      <button
        type="button"
        className="
          mt-8
          w-full
          rounded-2xl
          bg-[#181818]
          py-4
          text-sm
          font-bold
          text-white
          transition
          hover:bg-black
        "
      >
        Confirm Order
      </button>

    </aside>
  );
};

export default OrderDetails;