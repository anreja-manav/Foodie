import React, { useState } from "react";
import Dashboard from "../../components/Dashboard";

const HomePage = ({ admin }) => {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // if (vendor?.is_verified === false) {
  //   return <VendorNotVerifiedDashboard vendor={vendor} />;
  // }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black font-sans">
      <Dashboard admin = {admin}/>
    </div>
  );
}

export default HomePage;