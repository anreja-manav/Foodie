import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { CgProfile } from "react-icons/cg";
import { IoBagCheckOutline, IoCloudUploadSharp } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { NavLink, useNavigate } from "react-router";
import { LuMapPin } from "react-icons/lu";
import { MyContext } from "../../App";
import CircularProgress from '@mui/material/CircularProgress';
import { uploadImage } from '../../utils/api';

const AccountSidebar = () => {

  const BASE_URL = import.meta.env.VITE_API_URL;
  const [uploading, setUploading] = useState(false);
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(context?.userData);
  useEffect(() => {
    setUserData(context?.userData);
  }, [context?.userData]);


  const onChangeFile = async (e) => {
      const file = e.target.files[0];

      if (!file) return;

      const validTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/jpg",
      ];

      if (!validTypes.includes(file.type)) {
          context.alertBox(
              "error",
              "Please select a JPG, PNG or WEBP image."
          );
          return;
      }

      const formData = new FormData();
      formData.append("profile_pic", file);

      try {
          setUploading(true);

          const res = await uploadImage(
              "/accounts/customer/profile/update",
              formData
          );

          if (res?.error !== true) {
              context.alertBox("success", "Profile picture updated.");
              await context.getUserDetails();
          }else {
              context.alertBox("error", res?.message || "Upload failed");
          }
      } catch (err) {
          console.log(err);
          context.alertBox("error", "Image upload failed.");
      } finally {
          setUploading(false);
          e.target.value = "";
      }
  };

  const logout = async () => {
    localStorage.clear();
    context?.setIsLogin(false);
    context?.setUserData(null);
    context?.setCartData([]);
    context.alertBox("success", "Logged out successfully");
    
    navigate("/");
  };

  return (
    <div className='card bg-white shadow-md rounded-md 
                  w-full lg:w-auto 
                  lg:sticky lg:top-40'>

      {/* Profile Section */}
      <div className='w-full p-4 sm:p-5 flex items-center justify-center flex-col text-center'>

        {/* <div className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] 
                      rounded-full overflow-hidden mb-4 relative 
                      group flex items-center justify-center bg-gray-200">
            <img src={`${BASE_URL}${userData.ProfilePicture}`} alt="User" />

          
          <div className="overlay w-full h-full absolute top-0 left-0 z-50 
                        bg-[rgba(0,0,0,0.7)] flex items-center justify-center 
                        cursor-pointer opacity-0 
                        transition-all duration-300 
                        group-hover:opacity-100">

            <IoCloudUploadSharp className="text-white text-[22px] sm:text-[25px]" />

            <input
              type="file"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={(e) => onChangeFile(e, "/api/user/user-avatar")}
              name="avatar"
            />
          </div>
        </div> */}

        <div className="relative group w-27.5 h-27.5 rounded-full overflow-hidden">

    <img
        src={
            userData?.ProfilePicture
                ? `${BASE_URL}${userData.ProfilePicture}`
                : "/default-avatar.png"
        }
        className="w-full h-full object-cover"
        alt=""
    />

    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">

            {uploading ? (
                <CircularProgress
                    size={28}
                    sx={{ color: "#fff" }}
                />
            ) : (
                <>
                    <IoCloudUploadSharp className="text-white text-3xl" />

                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={onChangeFile}
                    />
                </>
            )}
        </div>

    </div>

        <h3 className="text-[16px] sm:text-[18px] font-semibold">
          {userData?.Name}
        </h3>

        <h6 className="text-[12px] sm:text-[13px] font-medium 
                     truncate w-full max-w-55 sm:max-w-65 
                     text-gray-600">
          {userData?.Email}
        </h6>
      </div>

      {/* Navigation Tabs */}
      <ul className='list-none pb-4 sm:pb-5 bg-[#f1f1f1] myAccountTabs'>

        {[
          { to: "/my-account", icon: <CgProfile className='text-[18px]' />, label: "My Profile" },
          { to: "/my-address", icon: <LuMapPin className='text-[18px]' />, label: "Address" },
          { to: "/my-orders", icon: <IoBagCheckOutline className='text-[17px]' />, label: "My Orders" }
        ].map((item, index) => (
          <li key={index} className='w-full'>
            <NavLink to={item.to} exact activeClassName="isActive">
              <Button
                className='w-full! text-left! py-2! sm:py-3! 
                         px-4! sm:px-5! justify-start! 
                         capitalize! text-[rgba(0,0,0,0.8)]! 
                         rounded-none! flex items-center gap-2'
              >
                {item.icon}
                <span className="text-[14px] sm:text-[15px]">
                  {item.label}
                </span>
              </Button>
            </NavLink>
          </li>
        ))}

        {/* Logout */}
        <li className='w-full'>
          <Button
            onClick={logout}
            className='w-full! text-left! py-2! sm:py-3! 
                     px-4! sm:px-5! justify-start! 
                     capitalize! text-[rgba(0,0,0,0.8)]! 
                     rounded-none! flex items-center gap-2'
          >
            <IoIosLogOut className='text-[18px]' />
            <span className="text-[14px] sm:text-[15px]">
              Logout
            </span>
          </Button>
        </li>

      </ul>
    </div>
  );
}

export default AccountSidebar;