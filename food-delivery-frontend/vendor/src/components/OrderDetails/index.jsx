import React, { useState } from "react";
import {
  FiMapPin,
  FiClock,
  FiShoppingCart,
  FiEdit2,
  FiMinus,
  FiPlus,
} from "react-icons/fi";

const TABS = ["Delivery", "Dine In", "Takeaway"];

const OrderDetails = ({order, onBack}) => {
  const [tab, setTab] = useState("Delivery");
  const items = order?.items;
  const BaseURL = import.meta.env.VITE_API_URL;

  if (!order) return null;


  return (
    <aside className="flex h-full w-[380px] shrink-0 flex-col gap-5 overflow-y-auto border-l border-white/10 bg-[#0d0d0d] p-5">
      {/* Delivery address */}
      <div className="rounded-2xl bg-[#232323] p-5 text-white">
        <h3 className="mb-3 text-sm font-bold tracking-wide">
          DELIVERY ADDRESS
        </h3>
        <p className="mb-2 flex items-start gap-2 text-sm text-gray-300">
          <FiMapPin className="mt-0.5 shrink-0" size={14} />
          {order.user_name},{order.address},{order.city},{order.pincode}, ({order.contact_number})
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-300">
          <FiClock size={14} />
          20 min
        </p>
      </div>

      {/* Cart header */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold text-white">
            <FiShoppingCart size={16} />
            Cart
          </h3>
          <span className="text-xs text-gray-500">
            Order ID: #{order.id}
          </span>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex items-center gap-2 rounded-full bg-[#1a1a1a] p-1 text-sm">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                "flex-1 rounded-full py-2 font-medium transition-colors",
                tab === t
                  ? "bg-red-500 text-white"
                  : "text-gray-400 hover:text-gray-200",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Items */}
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item?.product} className="flex items-start gap-3">
              <div className="img w-[30%] sm:w-[20%] lg:w-[15%] rounded-md overflow-hidden">
                <img
                  src={`${BaseURL}${item?.image}`}
                  alt={item?.name}
                  className="w-full group-hover:scale-105 transition-all"
                  onClick={() => context.handleOpenDishDetailsModal(true, dish)}
                />
            </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {item.name}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-200">{item.qty}</span>
                </div>
              </div>
              <button
                type="button"
                aria-label={`Edit ${item.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black"
              >
                <FiEdit2 size={12} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-dashed border-white/10" />

      {/* Promotion code */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Promotion Code</span>
        <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black">
          TRYNEW
        </span>
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between text-gray-400">
          <span>Sub Total</span>
          <span className="text-gray-200">₹{order?.total_ammount}</span>
        </div>
        <div className="flex items-center justify-between text-gray-400">
          <span>Delivery Charge</span>
          <span className="text-gray-200">
            Free
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-base font-bold text-white">
          <span>TOTAL</span>
          <span>{order?.total_ammount}</span>
        </div>
      </div>

      <button
        type="button"
        className="mt-1 rounded-2xl bg-white py-3 text-sm font-bold text-black transition-colors hover:bg-gray-200"
      >
        Confirm Order
      </button>
    </aside>
  );
}

export default OrderDetails;