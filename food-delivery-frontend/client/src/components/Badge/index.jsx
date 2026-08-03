import React from "react";

const STATUS_STYLES = {
  pending: "bg-orange-600 text-white",
  placed: "bg-yellow-500 text-white",
  confirmed: "bg-blue-500 text-white",
  preparing: "bg-amber-500 text-white",
  out_for_delivery: "bg-purple-500 text-white",
  delivered: "bg-green-700 text-white",
  success: "bg-green-700 text-white",
  cancelled: "bg-red-600 text-white",
  failed: "bg-red-600 text-white",
};

const Badge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || "unknown";
  const badgeStyle =
    STATUS_STYLES[normalizedStatus] || "bg-gray-300 text-black";

  return (
    <span
      className={`inline-block py-1 px-4 text-[11px] rounded-full font-semibold ${badgeStyle}`}
    >
      {normalizedStatus.replace(/_/g, " ")}
    </span>
  );
};

export default Badge;