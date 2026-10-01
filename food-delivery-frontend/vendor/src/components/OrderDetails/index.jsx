import React, { useState, useContext } from "react";
import {
  FiMapPin,
  FiClock,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";
import { editData } from "../../utils/api";
import {MyContext} from "../../App";


const OrderDetails = ({ order, onBack }) => {
  const STATUS_FLOW = ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

  const NEXT_STEP_LABEL = {
    PLACED: "Confirm Order",
    CONFIRMED: "Preparing",
    PREPARING: "Out for Delivery",
    OUT_FOR_DELIVERY: "Mark as Delivered",
  };
  
  const getNextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  const context = useContext(MyContext);
  const [status, setStatus] = useState(order?.order_status || "PLACED");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const BaseURL = import.meta.env.VITE_API_URL;

  if (!order) {
    return null;
  }

  const items = order?.items || [];

  const updateOrderStatus = async (newStatus, id) => {
    if (!newStatus || updating) return;
    if (!id){
      context?.alertBox("error", "Order Id is required");
      return
    }
    setUpdating(true);
    setError(null);
    try{
      const res = await editData(`/orders/update/${id}/status`, {"order_status": newStatus})
      if (res?.error === false){
        setStatus(newStatus);
        context?.alertBox("success", `Order Staus is ${newStatus}`);
        context?.getOrders();
      }else{
        context?.alertBox("error", res?.message || "Failed to update status");
        return;
      }
    }catch (err) {
      context?.alertBox("error", "Something went wrong. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  const handleAdvanceStatus = (id) => updateOrderStatus(getNextStatus(status), id);
  const handleCancelOrder = (id) => updateOrderStatus("CANCELLED", id);
 
  const isCancelled = status === "CANCELLED";
  const isDelivered = status === "DELIVERED";
  const nextLabel = NEXT_STEP_LABEL[status];

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
      <div className="mt-6 pt-6 ">

        {/* Cart Header */}
        <div className="pb-4 flex items-center justify-between border-b border-white/10">

          <h3 className="flex items-center gap-2 text-base font-semibold text-white">
            <FiShoppingCart size={17} />
            Cart
          </h3>

          <span className="text-xs text-gray-500">
            Order ID: #{order.id}
          </span>

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
      <div className="py-6 flex flex-col gap-3">

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


      {error && (
        <p className="mb-2 text-center text-xs text-red-400">{error}</p>
      )}
 
      {/* Status-driven actions */}
      {isCancelled ? (
        <p className="mt-8 w-full rounded-2xl bg-[#181818] py-4 text-center text-sm font-bold text-red-400">
          Order Cancelled
        </p>
      ) : isDelivered ? (
        <p className="mt-8 w-full rounded-2xl bg-[#181818] py-4 text-center text-sm font-bold text-green-400">
          Order Delivered
        </p>
      ) : (
        <>
          {/* Advance to next status */}
          <button
            type="button"
            onClick={() => handleAdvanceStatus(order?.id)}
            disabled={updating}
            className="
              mt-8
              w-full
              rounded-2xl
              bg-orange-600
              py-4
              text-sm
              font-bold
              text-white
              transition
              hover:bg-orange-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {updating ? "Updating..." : nextLabel}
          </button>
          <br></br>
          {/* Cancel only available before the order is confirmed */}
          {status === "PLACED" && (
            <button
              type="button"
              onClick={() => handleCancelOrder(order?.id)}
              disabled={updating}
              className="
                mt-4
                w-full
                rounded-2xl
                bg-[#181818]
                py-4
                text-sm
                font-bold
                text-white
                transition
                hover:bg-black
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              Cancel Order
            </button>
          )}
        </>
      )}

    </aside>
  );
};

export default OrderDetails;