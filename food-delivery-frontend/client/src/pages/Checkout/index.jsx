import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import { BsFillBagCheckFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { MyContext } from "../../App";
import { postData, deleteData, fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Base_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const context = useContext(MyContext);
  const history = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isChecked, setIsChecked] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setUserData(context?.userData);
    setSelectedAddress(context?.userData?.Addresses?.[0]?.id || "");
  }, [context?.userData]);

  useEffect(() => {
    const total =
      context?.cartData?.length !== 0
        ? context?.cartData
          ?.map((item) => parseInt(item.dish.price) * item.quantity)
          .reduce((total, value) => total + value, 0)
        : 0;

    setTotalAmount(total);
  }, [context?.cartData]);


  const onApprovePayment = async (data) => {
    const user = context?.userData;

    const info = {
      userId: user?._id,
      products: context?.cartData,
      payment_status: "COMPLETE",
      delivery_address: selectedAddress,
      totalAmount: totalAmount,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/order/capture-order-paypal`,
      {
        ...info,
        paymentId: data.orderID,
      },
      { headers }
    );

    if (response?.data?.success) {
      context.alertBox("success", "Order completed and saved to database!");
      history("/order/success");

      deleteData(`/api/cart/emptyCart/${context?.userData?._id}`).then(() => {
        context?.getCartItems();
      });
    }
  };

  const editAddress = (id) => {
    context?.setOpenAddressPanel(true);
    context?.setAddressMode("edit");
    context?.setAddressId(id);
  };

  const handleChange = (e, index) => {
    if (e.target.checked) {
      setIsChecked(index);
      setSelectedAddress(e.target.value);
    }
  };


  const cashOnDelivery = () => {
    const user = context?.userData;

    if (userData?.Addresses?.length !== 0) {
      const orderData = {
        delivery_address: selectedAddress,
        items: context.cartData.map((item) => ({
          product: item.dish.id,
          quantity: item.quantity,
          price: item.dish.price
        })),
      };

      postData(`orders/place_order`, orderData)
        .then((res) => {
          if (res?.error === false) {
            context.alertBox("success", res?.message);

            deleteData(`/cart/clear_cart`).then(() => {
              context?.getCartItems();
            });

            history("/order-complete");
          } else {
            history("/order-failed");
          }
        })
        .catch(() => {
          history("/order-failed");
        });
    } else {
      context.alertBox("error", "Please add a delivery address");
    }
  };

  return (
    <section className="py-6 lg:py-12 px-3 bg-[#fafafa]">
      <form >
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row gap-6">

            {/* LEFT COLUMN: Delivery Address */}
            <div className="w-full md:w-[60%]">
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center justify-between pb-4">
                  <h2 className="text-lg font-semibold">
                    Select Delivery Address
                  </h2>

                  <Button
                    variant="outlined"
                    size="small"
                    className="btn"
                    onClick={() => {
                      context?.setOpenAddressPanel(true);
                      context?.setAddressMode("add");
                    }}
                  >
                    <FaPlus className="mr-1" />
                    {context?.windowWidth < 767 ? "" : "Add New Address"}
                  </Button>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  {userData?.Addresses?.length ? (
                    userData.Addresses
                        .filter(
                            (address) =>
                            address.city?.trim().toLowerCase() ===
                            context?.formFields?.city?.trim().toLowerCase()
                        )
                        .map((address, index) => (
                      <label
                        key={address.id}
                        className={`flex gap-3 p-4 border rounded-md relative cursor-pointer transition ${isChecked === index
                            ? "bg-[#fff2f2] border-[#ff5252]"
                            : "border-[rgba(0,0,0,0.1)]"
                          }`}
                      >
                        <Radio
                          size="small"
                          checked={isChecked === index}
                          value={address.id}
                          onChange={(e) => handleChange(e, index)}
                        />

                        <div className="flex-1">
                          <span className="inline-block text-xs font-medium px-2 py-1 bg-[#f1f1f1] rounded mb-1">
                            {address.address_type}
                          </span>

                          <h3 className="text-sm font-semibold">{userData.name}</h3>

                          <p className="text-sm text-gray-600 leading-snug">
                            {address.address}, {address.city}, {address.state}
                          </p>

                          <p className="text-sm font-medium mt-1">{address.contact_number}</p>
                        </div>

                        <Button
                          size="small"
                          variant="text"
                          className="absolute top-3 right-3"
                          onClick={() => editAddress(address.id)}
                        >
                          Edit
                        </Button>
                      </label>
                    ))
                  ) : (
                    <div className="flex flex-col items-center py-10 text-center">
                      <img src="/map.png" width="90" className="mb-3" />
                      <h3 className="font-semibold">No addresses found</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Please add a delivery address
                      </p>
                      <Button
                        className="btn-org"
                        onClick={() => {
                          context?.setOpenAddressPanel(true);
                          context?.setAddressMode("add");
                        }}
                      >
                        Add Address
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div className="w-full md:w-[40%] mt-6 md:mt-0">
              <div className="bg-white shadow-md rounded-lg p-4 sm:p-5 md:p-6 md:sticky md:top-6">

                <h2 className="text-base sm:text-lg font-semibold mb-4">
                  Your Order
                </h2>

                {/* HEADER */}
                <div className="flex justify-between py-2 border-b text-xs sm:text-sm font-semibold">
                  <span>Items</span>
                  <span>Subtotal</span>
                </div>

                {/* PRODUCT LIST */}
                <div className="max-h-55 sm:max-h-65 overflow-y-auto mt-2 pr-1 sm:pr-2">

                  {context?.cartData?.length > 0 ? (
                    context.cartData.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b last:border-none"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 w-[65%]">

                          <img
                            src={`${Base_URL}${item.dish.image}`}
                            alt=""
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                          />

                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium truncate">
                              {item.dish.name}
                            </p>

                            <p className="text-[11px] sm:text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs sm:text-sm font-medium text-right">
                          {(item.dish.price * item.quantity).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-sm text-gray-500">
                      No items in cart
                    </div>
                  )}

                </div>

                {/* TOTAL SECTION */}
                <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.1)] space-y-2">

                  <div className="flex justify-between text-sm pb-3">
                    <span>Subtotal</span>
                    <span>
                      {totalAmount.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between text-base sm:text-lg font-semibold mt-auto">
                    <span>Total</span>
                    <span className="text-orange-600">
                      {totalAmount.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>

                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-3 mt-6">

                  <Button
                    type="button"
                    className="btn-dark w-full flex items-center justify-center gap-2 min-h-11 btn-org btn-l"
                    onClick={cashOnDelivery}
                  >
                    <BsFillBagCheckFill />
                    <span className="hidden sm:inline">Checkout</span>
                  </Button>

                </div>

              </div>
            </div>

          </div>
        </div>
      </form>
    </section>
  );

};

export default Checkout;