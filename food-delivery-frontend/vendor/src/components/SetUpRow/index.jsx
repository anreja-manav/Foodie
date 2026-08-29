import React from "react";
import { Link } from "react-router-dom";

const SetupRow = ({ item }) => {
  const Icon = item.icon;
  const locked = item.status === "locked";
  const ActionIcon = item.actionIcon;

  return (
    <div
      className={`flex h-[50px] items-center justify-between rounded-lg border px-4 mb-2 ${
        locked
          ? "border-transparent text-[#1F2421]/40"
          : "border-[#1F2421]/10"
      }`}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Icon
          size={18}
          className={
            locked
              ? "text-[#1F2421]/35"
              : "text-green-600"
          }
        />

        <p
          className={`text-[14px] font-semibold ${
            locked ? "text-[#1F2421]/40" : "text-[#1F2421]"
          }`}
        >
          {item.label}
        </p>
      </div>

      {/* Right side */}
      {locked ? (
        <span className="text-[13px] text-[#1F2421]/40">
          Locked
        </span>
      ) : (
        <Link to={item.redirect}>
          <ActionIcon
            size={20}
            className="text-blue-500"
          />
        </Link>
      )}
    </div>
  );
};

export default SetupRow;