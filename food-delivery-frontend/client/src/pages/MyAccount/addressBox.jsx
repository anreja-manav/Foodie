import React, { useContext } from "react";
import { FaHome, FaMapMarkerAlt } from "react-icons/fa";
import { MyContext } from "../../App";

const AddressBox = ({ address, removeAddress }) => {
  const context = useContext(MyContext);

  const editAddress = () => {
    context.setOpenAddressPanel(true);
    context.setAddressMode("edit");
    context.setAddressId(address.id);
  };

  return (
    <div className="border border-gray-300 rounded-sm bg-white p-5 hover:shadow-md transition-all min-h-33.25">
      <div className="flex items-start gap-2">
        <div className="text-2xl text-gray-700 mt-1">
          {address.address_type === "home" ? <FaHome /> : <FaMapMarkerAlt />}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold capitalize">
            {address.address_type}
          </h3>

          <p className="text-sm text-gray-700 mt-1 leading-5">
            {address.address}, {address.city}, {address.state}, {address.pincode}
          </p>

          <div className="flex gap-4 mt-2">
            <button
              onClick={editAddress}
              className="text-sm uppercase font-semibold text-orange-600 hover:text-orange-700"
            >
              Edit
            </button>

            <button
              onClick={() => removeAddress(address.id)}
              className="text-sm uppercase font-semibold text-orange-600 hover:text-orange-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressBox;