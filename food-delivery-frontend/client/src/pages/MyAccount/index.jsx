import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Collapse } from "react-collapse";
import { Link, useNavigate } from "react-router-dom";

import AccountSidebar from "../../components/AccountSidebar";
import { MyContext } from "../../App";
import { deleteData, editData, postData } from "../../utils/api";

const MyAccount = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isChangePasswordFormShow, setIsChangePasswordFormShow] =
    useState(false);

  const userData = context?.userData;

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [changePassword, setChangePassword] = useState({
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/");
    }
  }, [context.isLogin, navigate]);

  useEffect(() => {
    if (!userData) return;

    setFormFields({
      name: userData.Name || "",
      email: userData.Email || "",
      phone: userData.Phone || "",
    });

    setChangePassword({
      phone: userData.Phone || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onChangePasswordInput = (e) => {
    const { name, value } = e.target;

    setChangePassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const deleteProfile = async () => {
    try {
      const res = await deleteData("/accounts/customer/profile/delete");

      if (res?.error === false) {
        context.alertBox(
          "success",
          res?.message || "Profile Deleted."
        );
        localStorage.clear();
        context?.setIsLogin(false);
        context?.setUserData(null);
        context?.setCartData([]);
        navigate('/')
        

      } else {
        context.alertBox(
          "error",
          res?.message || "Something went wrong."
        );
      }
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        "Something went wrong.";

      context.alertBox("error", message);
    }
  };

  const isProfileChanged =
    formFields.name !== (userData?.Name || "") ||
    formFields.email !== (userData?.Email || "") ||
    formFields.phone !== (userData?.Phone || "");

  const isProfileValid =
    formFields.name.trim() !== "" &&
    formFields.email.trim() !== "" &&
    formFields.phone.trim() !== "" &&
    isProfileChanged;

  const isPasswordValid =
    changePassword.oldPassword &&
    changePassword.newPassword &&
    changePassword.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await editData(
        "/accounts/customer/profile/update",
        formFields
      );

      if (res?.error === false) {
        context.alertBox("success", res?.message || "Profile updated.");

        // Refresh user data
        await context.getUserDetails();
      } else {
        context.alertBox("error", res?.message || "Update failed.");
      }
    } catch (error) {
          console.error(error);

          const errors = error.response?.data?.message;

          let message = "Something went wrong.";

          if (errors && typeof errors === "object") {
              const firstKey = Object.keys(errors)[0];
              message = errors[firstKey][0];
          }

          context.alertBox("error", message);
      }finally {
        setIsLoading(false);
    }
  };

  const handleSubmitChangePassword = async (e) => {
    e.preventDefault();

    if (changePassword.newPassword !== changePassword.confirmPassword) {
      context.alertBox("error", "Passwords do not match.");
      return;
    }

    setIsLoading2(true);

    try {
      const res = await postData(
        "/accounts/forgot-password/",
        changePassword
      );

      if (!res?.error) {
        context.alertBox(
          "success",
          res?.message || "Password changed successfully."
        );

        setChangePassword({
          phone: userData?.Phone || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setIsChangePasswordFormShow(false);
      } else {
        context.alertBox("error", res?.message || "Failed.");
      }
    } catch (error) {
      console.error(error);
      context.alertBox("error", "Something went wrong.");
    } finally {
      setIsLoading2(false);
    }
  };

  return (
    <section className="py-3 lg:py-10 w-full">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[20%]">
          <AccountSidebar />
        </div>

        <div className="w-full lg:w-[60%]">
          <div className="bg-white p-5 shadow-md rounded-md mb-5 flex items-center justify-between">
            <h2 className="text-[23px] font-semibold">My Profile</h2>

            <div className="flex gap-3">
              <Button
                className="btn-blue btn-sm rounded-full!"
                onClick={() =>
                  setIsChangePasswordFormShow(
                    !isChangePasswordFormShow
                  )
                }
              >
                Change Password
              </Button>

                <Button className="btn-blue btn-sm rounded-full!" onClick={() => {deleteProfile()}}>
                  Delete Profile
                </Button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-white p-5 shadow-md rounded-md"
          >
            <TextField
              label="Full Name"
              name="name"
              size="small"
              value={formFields.name}
              onChange={onChangeInput}
              disabled={isLoading}
              fullWidth
            />

            <TextField
              label="Email"
              name = "email"
              size="small"
              value={formFields.email}
              onChange={onChangeInput}
              disabled={isLoading}
              fullWidth
            />

            <TextField
              label="Phone Number"
              name="phone"
              size="small"
              value={formFields.phone}
              onChange={onChangeInput}
              disabled={isLoading}
              fullWidth
            />

            <div className="sm:col-span-2">
              <Button
                type="submit"
                disabled={!isProfileValid || isLoading}
                className="btn-org btn-lg w-55"
              >
                {isLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>

          <Collapse isOpened={isChangePasswordFormShow}>
            <div className="mt-6 bg-white p-5 shadow-md rounded-md">
              <h3 className="text-lg font-semibold mb-4">
                Change Password
              </h3>

              <form
                onSubmit={handleSubmitChangePassword}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <TextField
                  type="password"
                  label="Old Password"
                  name="oldPassword"
                  value={changePassword.oldPassword}
                  onChange={onChangePasswordInput}
                  disabled={isLoading2}
                  fullWidth
                />

                <TextField
                  type="password"
                  label="New Password"
                  name="newPassword"
                  value={changePassword.newPassword}
                  onChange={onChangePasswordInput}
                  disabled={isLoading2}
                  fullWidth
                />

                <TextField
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={changePassword.confirmPassword}
                  onChange={onChangePasswordInput}
                  disabled={isLoading2}
                  fullWidth
                />

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={!isPasswordValid || isLoading2}
                    className="btn-org btn-lg w-55"
                  >
                    {isLoading2 ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Collapse>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;