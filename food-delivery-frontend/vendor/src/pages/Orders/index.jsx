import React, { useContext, useState } from "react";
import SectionHeading from "../../components/SectionHeading";
import { MyContext } from "../../App";
import NotLogin from "../../components/notLogin";
import VendorNotVerifiedDashboard from "../../components/VendorNotVerified";
import OrderList from "../../components/OrderList";
import OrderDetails from "../../components/OrderDetails";

const Orders = () => {
  const context = useContext(MyContext);
  const vendor = context?.vendorData;
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Authentication & Verification guards
  if (vendor === null) {
    return <NotLogin />;
  }

  if (vendor?.vendor_profile?.is_verified === false) {
    return <VendorNotVerifiedDashboard />;
  }

  const isOrderDetailsOpen = selectedOrder !== null;

  return (
    <div className="relative flex h-full min-w-0 flex-1 overflow-hidden bg-[#0d0d0d]">
      {/* Main Order Content */}
      <div
        className={`h-full min-w-0 flex-1 overflow-y-auto px-8 py-6 transition-all duration-300 ${
          isOrderDetailsOpen ? "pr-[410px]" : ""
        }`}
      >
        <OrderList
          SectionHeading={SectionHeading}
          selectedOrder={selectedOrder}
          onSelectOrder={setSelectedOrder}
        />
      </div>

      {/* Slide-out Order Details Panel */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;