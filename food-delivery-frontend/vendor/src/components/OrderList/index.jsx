import React, { useContext } from "react";
import { MyContext } from "../../App";


const OrderList = ({
  SectionHeading,
  selectedOrder,
  onSelectOrder,
}) => {

  const context = useContext(MyContext);

  const orders = context?.orders || [];


  const STATUS_STYLES = {
    PLACED: "bg-gray-500/15 text-gray-400",

    CONFIRMED:
      "bg-blue-500/15 text-blue-400",

    PREPARING:
      "bg-orange-500/15 text-orange-400",

    OUT_FOR_DELIVERY:
      "bg-purple-500/15 text-purple-400",

    DELIVERED:
      "bg-green-500/15 text-green-400",

    CANCELLED:
      "bg-red-500/15 text-red-400",
  };


  return (
    <section className="w-full p-5">

      {/* Heading */}

      <SectionHeading title="Order Reports" />


      {/* Table */}

      <div className="overflow-hidden rounded-2xl bg-[#1a1a1a]">

        <table className="w-full text-left text-sm">

          <thead>

            <tr className="text-gray-500">

              <th className="px-5 py-3 font-medium">
                Customer
              </th>

              <th className="px-5 py-3 font-medium">
                Order number
              </th>

              <th className="px-5 py-3 font-medium">
                Address
              </th>

              <th className="px-5 py-3 font-medium">
                Amount
              </th>

              <th className="px-5 py-3 font-medium">
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {orders.length > 0 ? (

              orders.map((order) => (

                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}

                  className={`
                    cursor-pointer

                    border-t
                    border-white/5

                    text-gray-300

                    transition

                    hover:bg-[#232323]

                    ${
                      selectedOrder?.id === order.id
                        ? "bg-[#232323]"
                        : ""
                    }
                  `}
                >

                  {/* Customer */}

                  <td className="px-5 py-3">
                    {order.user_name}
                  </td>


                  {/* Order number */}

                  <td className="px-5 py-3">
                    {order.id}
                  </td>


                  {/* Address */}

                  <td className="px-5 py-3">
                    {order.address}
                  </td>


                  {/* Amount */}

                  <td className="px-5 py-3">
                    ₹{order.total_ammount}
                  </td>


                  {/* Status */}

                  <td className="px-5 py-3">

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold

                        ${
                          STATUS_STYLES[
                            order.order_status
                          ] ||
                          "bg-gray-500/15 text-gray-300"
                        }
                      `}
                    >
                      {order.order_status}
                    </span>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="5"
                  className="
                    px-5
                    py-10
                    text-center
                    text-gray-500
                  "
                >
                  No orders available.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
};


export default OrderList;