import React, { useState } from "react";
import VendorNotVerifiedDashboard from "../../components/VendorNotVerified";
import Sidebar from "../../components/Sidebar";
import Dashboard from "../../components/Dashboard";
import OrderDetail from "../../components/OrderDetails";

const HomePage = ({ vendor }) => {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // if (vendor?.is_verified === false) {
  //   return <VendorNotVerifiedDashboard vendor={vendor} />;
  // }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black font-sans">
      <Sidebar active={activeNav} onNavigate={setActiveNav} />

      <Dashboard onSelectOrder={setSelectedOrder} vendor = {vendor}/>

      {/* Order Detail only renders once an order row has been clicked */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onConfirm={() => {
            // handle order confirmation, e.g. call an API, then clear selection
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}

export default HomePage;