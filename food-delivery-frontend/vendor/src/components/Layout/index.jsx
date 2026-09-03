import React from "react";
import { Outlet } from "react-router-dom"; 
import Sidebar from "../Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0d0d0d]">
      <Sidebar />
      <main className="flex h-full min-w-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;