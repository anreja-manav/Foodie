import React, { useContext } from "react";
import {
  FiGrid,
  FiFileText,
  FiMapPin,
  FiLogOut,
  FiLogIn,
  FiSettings,
  FiBell,
} from "react-icons/fi";
import logo from "../../../../../Assests/Logo.jpg"
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MyContext } from "../../App";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: FiGrid, to: "/" },
  { key: "orders", label: "Orders", icon: FiFileText, to: "/orders" },
  { key: "restaurant", label: "Restaurants", icon: FiMapPin, to: "/restaurant"},
];


const Sidebar = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();
  const vendor = context?.vendorData;

  // Derive the active key from the current path instead of a prop
  const activeItem = NAV_ITEMS.find((item) => item.to === location.pathname);
  const active = activeItem?.key;

  const logout = async () => {
    if (vendor === null){
      context?.alertBox("error", "You're not login. Please Login First");
      navigate("/login");
    }
    else{
    localStorage.clear();
    context?.setIsLogin(false);
    context?.setVendorData(null);
    context.alertBox("success", "Logged out successfully");

    navigate("/login");
    }
  };


  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col bg-[#0d0d0d] px-4 py-6">
      {/* Logo */}
      <div className="mb-8 px-2 pb-3">
        <Link to={"/"}>
          <img src={logo} alt="logo" className="border rounded-xl"/>
        </Link>
      </div>

      {/* Nav rail */}
      <nav className="flex-1 rounded-[28px] bg-[#1a1a1a] p-3 shadow-inner">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon, to }) => {
            const isActive = key === active;
            return (
              <li key={key}>
                <Link to={to}>
                <button
                  type="button"
                  className={[
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#2a2a2a] text-red-500"
                      : "text-gray-400 hover:bg-[#232323] hover:text-gray-200",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      isActive ? "bg-red-500 text-white" : "text-gray-400",
                    ].join(" ")}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="whitespace-nowrap">{label}</span>
                </button>
                </Link>
              </li>
            );
          })}

          <li>
            {vendor === null ? 
              <Link to= "/login">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors text-gray-400 hover:bg-[#232323] hover:text-gray-200"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400"
                  >
                    <FiLogIn size={16} />
                  </span>
                  <span className="whitespace-nowrap">Login</span>
                </button>
              </Link>
            :
            <button
              type="button"
              onClick={() => logout()}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors text-gray-400 hover:bg-[#232323] hover:text-gray-200"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400"
              >
                <FiLogOut size={16} />
              </span>
              <span className="whitespace-nowrap">Logout</span>
            </button>
          }
          </li>
        </ul>
      </nav>

      {/* Footer actions */}
      <div className="mt-4 flex items-center gap-3 px-1 pt-3">
        <button
          type="button"
          aria-label="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-300 hover:text-white"
        >
          <FiSettings size={16} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-300 hover:text-white"
        >
          <FiBell size={16} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;