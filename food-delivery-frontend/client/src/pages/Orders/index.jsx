import React, { useContext, useEffect, useState } from "react";
import AccountSidebar from '../../components/AccountSidebar';
import Button from "@mui/material/Button";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Badge from "../../components/Badge";
import { MyContext } from "../../App";
import { editData, fetchDataFromApi, deleteData } from "../../utils/api";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";

const Orders = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [order, setOrder] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const context = useContext(MyContext);
  const userId = localStorage.getItem("userId");
  const imgUrl = import.meta.env.VITE_API_URL;


  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  }

  const fetchOrders = async () => {
    setOrdersLoading(true);

    fetchDataFromApi(`/orders/my_orders`)
      .then((res) => {
        if (res.error === true) {
          setOrdersLoading(false);
          context.alertBox("error", "Failed to load orders");
          setOrder([]);
          return;
        }

        if (res.data.length === 0) {
          setOrder([]);
          setOrdersLoading(false);
          return;
        }

        const formattedOrders = res.data.map((order) => {
          return {
            orderId: order.id,
            paymentStatus: order.payment_status,
            name: order.user_name || "—",
            amount: order.total_ammount || 0,
            ph_no: order.contact_number || "—",
            address:`${order.address}, ${order.city}, ${order.pincode}`,
            date: new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            dishes: order.items?.map((item) => ({
              id: item?.product,
              image: item.image,
              name: item.name,
              price: item?.price,
              qty: item.quantity,
              restaurant : item.restaurant,
              restaurantId: item.restaurant_id,
            })) || [],
            status: order.order_status || "—",
            pin: order.pincode || "—",
          };
        });

        setOrder(formattedOrders);
        setTotalOrders(formattedOrders.length);
        setOrdersLoading(false);
      })
      .catch(() => {
        context.alertBox("error", "Server error while fetching orders");
        setOrdersLoading(false);
        setOrder([]);
      });
  };


  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      const res = await editData(`/orders/${orderId}/cancel_order`);

      if (res?.error === false) {
        context.alertBox("success", res?.message || "Order cancelled successfully");
        fetchOrders(); 
      } else {
        context.alertBox("error", res?.message || "Unable to cancel order");
      }
    } catch (error) {
      context.alertBox("error", "Cancellation failed due to server error");
    }
  };


  return (
    <section className="py-5 lg:py-10 w-full">
      <div className="container flex flex-col lg:flex-row gap-5">
        {/* Sidebar */}
        <div className="col1 w-[20%] hidden lg:block">
          <AccountSidebar />
        </div>

        {/* Orders Table */}
        <div className="col2 w-full lg:w-[80%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2>My Orders</h2>
              <p className="mt-0">
                There are <span className="font-bold text-orange-600">{totalOrders}</span> orders
              </p>
            </div>

            {/* Empty state */}
            {!ordersLoading && order.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-sm text-gray-500 mb-6">
                  You haven’t placed any orders yet. Let’s start order.
                </p>
                <Button className="btn-org" onClick={() => window.location.href = "/"}>
                  Go Order
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto mt-5">
                <table className="w-full text-sm text-left text-black min-w-200">
                  <thead className="text-xs text-black uppercase bg-[#f1f1f1]">
                    <tr>
                      <th className="px-6 py-3">&nbsp;</th>
                      <th className="px-6 py-3">Order Id</th>
                      <th className="px-6 py-3">Payment Staus</th>
                      <th className="px-6 py-3">Payment Id</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Address</th>
                      <th className="px-6 py-3">Pincode</th>
                      <th className="px-6 py-3">Total Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">&nbsp;</th>
                      <th className="px-6 py-3">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.map((row, index) => (
                      <React.Fragment key={row.orderId}>
                        <tr className="bg-white border-b font-semibold">
                          {/* Expand button */}
                          <td className="px-6 py-4">
                            <Button
                              className="w-8.75! h-8.75! min-w-8.75! rounded-full! bg-[#f1f1f1]!"
                              onClick={() => isShowOrderdProduct(index)}
                            >
                              {isOpenOrderdProduct === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </Button>
                          </td>

                          <td className="px-6 py-4 text-orange-600">{row.orderId}</td>
                          <td className="px-6 py-4 text-orange-600"><Badge status={row.paymentStatus} /></td>
                          <td className="px-6 py-4 text-orange-600">{row.paymentId}</td>
                          <td className="px-6 py-4">{row.ph_no}</td>
                          <td className="px-6 py-4 truncate max-w-50">{row.address}</td>
                          <td className="px-6 py-4">{row.pin}</td>
                          <td className="px-6 py-4">
                            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.amount)}
                          </td>
                          <td className="px-6 py-4">
                            <Badge status={row.status} />
                          </td>
                          <td className="px-6 py-4">
                            {new Date(row.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          {/* Cancel button */}
                          <td className="px-6 py-4">
                            {row.status !== "Delivered" && row.status !== "Cancelled" ? (
                              <Button size="small" className="ml-2 btn-org" onClick={() => cancelOrder(row.orderId)}>
                                Cancel
                              </Button>
                            ) : (
                              <Button size="small" className="ml-2 bg-gray-200 text-white" disabled>
                                Cancel
                              </Button>
                            )}
                          </td>

                        </tr>

                        {/* Expanded Order Details */}
                        {isOpenOrderdProduct === index && (
                          <tr>
                            <td colSpan={11} className="px-10 py-4 bg-[#fafafa]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Ordered & Delivery Dates */}
                                <div>
                                  <p className="text-sm font-semibold text-gray-600 mb-2">Ordered Date</p>
                                  <p className="text-sm text-gray-800">
                                    {new Date(row.date).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>

                                {/* Products */}
                                <div>
                                  <p className="text-sm font-semibold text-gray-600 mb-2">Products</p>
                                  <div className="flex gap-4 flex-wrap">
                                    {row.dishes.map((dish, i) => (
                                      <div key={i} className="flex flex-col items-center min-w-22.5">
                                        <Link to={`/restaurants/${dish.restaurantId}`}>
                                          <img
                                            src={`${imgUrl}${dish?.image}`}
                                            alt={dish.name}
                                            className="w-15 h-20 rounded-md object-cover border border-gray-200"
                                          />
                                        </Link>
                                        <span className="mt-1 text-xs font-medium">Qty: {dish.qty}</span>
                                        <span className="mt-1 text-xs font-medium">Restaurant: {dish.restaurant}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

}

export default Orders;