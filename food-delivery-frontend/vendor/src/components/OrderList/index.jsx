import React, { useContext, useState } from "react";
import { MyContext } from "../../App";
import OrderDetails from "../OrderDetails";

const OrderList = ({ SectionHeading }) => {
    const context = useContext(MyContext);
    const orders = context?.orders || [];

    const [selectedOrder, setSelectedOrder] = useState(null);

    const STATUS_STYLES = {
        PLACED: "bg-gray-500/15 text-gray-400",
        CONFIRMED: "bg-blue-500/15 text-blue-400",
        PREPARING: "bg-orange-500/15 text-orange-400",
        OUT_FOR_DELIVERY: "bg-purple-500/15 text-purple-400",
        DELIVERED: "bg-green-500/15 text-green-400",
        CANCELLED: "bg-red-500/15 text-red-400",
    };

    const onSelectOrder = (order) => {
        setSelectedOrder(order);
    };

    const onCloseDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="flex h-full w-full overflow-hidden">

            <section className="min-w-0 flex-1 overflow-y-auto p-5">
                <SectionHeading title="Order Reports" />

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
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => onSelectOrder(order)}
                                    className={`cursor-pointer border-t border-white/5 text-gray-300 hover:bg-[#232323] ${
                                        selectedOrder?.id === order.id
                                            ? "bg-[#232323]"
                                            : ""
                                    }`}
                                >
                                    <td className="px-5 py-3">
                                        {order.user_name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {order.id}
                                    </td>

                                    <td className="px-5 py-3">
                                        {order.address}
                                    </td>

                                    <td className="px-5 py-3">
                                        ₹{order.total_ammount}
                                    </td>

                                    <td className="px-5 py-3">
                                        <span
                                            className={[
                                                "rounded-full px-3 py-1 text-xs font-semibold",
                                                STATUS_STYLES[
                                                    order.order_status
                                                ] ??
                                                    "bg-gray-500/15 text-gray-300",
                                            ].join(" ")}
                                        >
                                            {order.order_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    onBack={onCloseDetails}
                />
            )}
        </div>
    );
};

export default OrderList;