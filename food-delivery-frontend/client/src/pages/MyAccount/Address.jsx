import React, { useContext, useEffect, useState } from "react";
import AccountSidebar from "../../components/AccountSidebar";
import { MyContext } from "../../App";
import AddressBox from "./addressBox";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const Address = () => {
  
  const [address, setAddress] = useState([]);
  const context = useContext(MyContext);

  useEffect(() => {
    if (context?.userData?.ID) {
      setAddress(context?.userData?.Addresses);
    }
  }, [context?.userData]);

  const removeAddress = (id) => {
    deleteData(`/accounts/customer/profile/address/delete/${id}/`).then(() => {
      fetchDataFromApi(
        '/accounts/customer/profile/address/'
      ).then((res) => {

        if (Array.isArray(res?.addresses)) {
          setAddress(res.addresses);
        } else {
          setAddress([]);
        }

        context?.getUserDetails();
      });
    });
  };

  return (
    <>
      <section className="py-4 lg:py-10 w-full min-h-[calc(100vh-80px)]">
        <div className="container flex flex-col md:flex-row gap-5 min-h-full">
          {/* Sidebar */}
          <div className="hidden md:block md:w-[20%]">
            <AccountSidebar />
          </div>

          {/* Address section */}
          <div className="col2 w-full md:w-[50%]flex-1 flex flex-col">
            <div className="card bg-white p-5 shadow-md rounded-md mb-5 flex-1 flex flex-col">
              <div className="flex items-center pb-3">
                <h2 className="pb-0">Address</h2>
              </div>

              <hr />

              <div
                className="flex items-center justify-center p-5 rounded-md border border-dashed border-[rgba(0,0,0,0.2)] bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer"
                onClick={() => {
                  context?.setOpenAddressPanel(true);
                  context?.setAddressMode("add");
                }}
              >
                <span className="text-[14px] font-medium">Add Address</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4  pt-4 overflow-y-auto">
                {address.length > 0 ? (
                  address.map((addr) => (
                    <AddressBox
                      key={addr.id}
                      address={addr}
                      removeAddress={removeAddress}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-[14px] font-medium text-gray-500 py-6">
                    No address found. Please add a new address.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Address;