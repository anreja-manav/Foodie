import React, { useState } from "react";
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
      <Dashboard onSelectOrder={setSelectedOrder} vendor = {vendor}/>

      {/* Order Detail only renders once an order row has been clicked */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onConfirm={() => {
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}

export default HomePage;