import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { postData, editData } from "../../utils/api";
import { darkFieldSx } from "../../utils/muiDarkStyles";
import { FiUpload } from "react-icons/fi";

const RestaurantForm = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const restaurant = context?.restaurantDetails;

  const isEdit = !!restaurant;

  const BaseURL = import.meta.env.VITE_API_URL;

  const [formFields, setFormFields] = useState({
    restaurant_name: "",
    restaurant_address: "",
    city: "",
    pincode: "",
    contact_number: "",
    restaurant_description: "",
    GST_number: "",
    Account_number: "",
    opening_time: "09:00",
    closing_time: "22:00",
  });

  const [picFile, setPicFile] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [fssaiFile, setFssaiFile] = useState(null);
  const [fssaiPreview, setFssaiPreview] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const picInputRef = useRef(null);
  const fssaiInputRef = useRef(null);

  // Pre-fill fields when editing an existing restaurant
  useEffect(() => {
    if (isEdit && restaurant) {
      setFormFields({
        restaurant_name: restaurant.restaurant_name || "",
        restaurant_address: restaurant.restaurant_address || "",
        city: restaurant.city || "",
        pincode: restaurant.pincode || "",
        contact_number: restaurant.contact_number || "",
        restaurant_description: restaurant.restaurant_description || "",
        GST_number: restaurant.GST_number || "",
        Account_number: restaurant.Account_number || "",
        opening_time: restaurant.opening_time || "09:00",
        closing_time: restaurant.closing_time || "22:00",
      });

      if (restaurant.resturant_pic) {
        setPicPreview(`${BaseURL}${restaurant.resturant_pic}`);
      }
      if (restaurant.fassai_certificate) {
        setFssaiPreview(`${BaseURL}${restaurant.fassai_certificate}`);
      }
    }
  }, [isEdit, restaurant, BaseURL]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onPicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
  };

  const onFssaiChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFssaiFile(file);
    setFssaiPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors = {};
    if (!formFields.restaurant_name) newErrors.restaurant_name = "Required";
    if (!formFields.restaurant_address) newErrors.restaurant_address = "Required";
    if (!formFields.city) newErrors.city = "Required";
    if (!formFields.pincode) newErrors.pincode = "Required";
    if (!formFields.contact_number) newErrors.contact_number = "Required";
    if (!isEdit && !picFile) newErrors.resturant_pic = "Restaurant photo is required";
    if (!isEdit && !fssaiFile) newErrors.fassai_certificate = "FSSAI certificate is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const data = new FormData();
    Object.entries(formFields).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (picFile) data.append("resturant_pic", picFile);
    if (fssaiFile) data.append("fassai_certificate", fssaiFile);

    const requestConfig = { headers: { "Content-Type": "multipart/form-data" } };

    const request = isEdit
      ? editData(`restaurants/update/${restaurant.id}/`, data, requestConfig)
      : postData("restaurants/add", data, requestConfig);

    request
      .then((res) => {
        setIsLoading(false);
        if (res?.error === false) {
          context.alertBox(
            "success",
            isEdit ? "Restaurant updated successfully" : "Restaurant added successfully"
          );
          context?.getRestaurantDetails();
          navigate("/restaurant");
        } else {
          const errorMsg =
            typeof res?.data === "object"
              ? Object.values(res.data).flat()[0]
              : res?.message || "Something went wrong";
          context.alertBox("error", errorMsg);
        }
      })
      .catch(() => {
        setIsLoading(false);
        context.alertBox("error", "Server error. Please try again later.");
      });
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#0d0d0d] px-8 py-6">
      <div className="max-w-3xl mx-auto rounded-2xl bg-[#1a1a1a] border border-white/10 p-6 sm:p-8 shadow-2xl">

        <h1 className="text-xl font-bold text-white pb-3">
          {isEdit ? "Edit Restaurant Details" : "Add Restaurant"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Restaurant photo */}
          <div className="flex flex-col justify-center gap-2">
            <span className="block text-xs font-semibold text-gray-400 uppercase pb-2">
              Restaurant Photo
            </span>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-xl overflow-hidden bg-[#292929] border border-white/10 shrink-0">
                {picPreview && (
                  <img src={picPreview} alt="Restaurant" className="h-full w-full object-cover" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={picInputRef}
                className="hidden"
                onChange={onPicChange}
              />
              <Button
                type="button"
                variant="outlined"
                startIcon={<FiUpload size={14} />}
                onClick={() => picInputRef.current?.click()}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#ef4444", borderColor: "#ef4444" },
                }}
              >
                {picPreview ? "Change Photo" : "Upload Photo"}
              </Button>
            </div>
            {errors.resturant_pic && (
              <p className="text-red-500 text-xs mt-1">{errors.resturant_pic}</p>
            )}
          </div>

          {/* Restaurant name */}
          <TextField
            label="Restaurant Name"
            name="restaurant_name"
            value={formFields.restaurant_name}
            onChange={onChangeInput}
            disabled={isLoading}
            fullWidth
            sx={darkFieldSx}
            error={!!errors.restaurant_name}
            helperText={errors.restaurant_name}
          />

          {/* Address */}
          <TextField
            label="Restaurant Address"
            name="restaurant_address"
            value={formFields.restaurant_address}
            onChange={onChangeInput}
            disabled={isLoading}
            fullWidth
            multiline
            rows={2}
            sx={darkFieldSx}
            error={!!errors.restaurant_address}
            helperText={errors.restaurant_address}
          />

          {/* City / Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField
              label="City"
              name="city"
              value={formFields.city}
              onChange={onChangeInput}
              disabled={isLoading}
              fullWidth
              sx={darkFieldSx}
              error={!!errors.city}
              helperText={errors.city}
            />
            <TextField
              label="Pincode"
              name="pincode"
              value={formFields.pincode}
              onChange={onChangeInput}
              disabled={isLoading}
              fullWidth
              sx={darkFieldSx}
              error={!!errors.pincode}
              helperText={errors.pincode}
              inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
            />
          </div>

          {/* Contact number */}
          <TextField
            label="Contact Number"
            name="contact_number"
            value={formFields.contact_number}
            onChange={onChangeInput}
            disabled={isLoading}
            fullWidth
            sx={darkFieldSx}
            error={!!errors.contact_number}
            helperText={errors.contact_number}
            inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
          />

          {/* Description */}
          <TextField
            label="Restaurant Description"
            name="restaurant_description"
            value={formFields.restaurant_description}
            onChange={onChangeInput}
            disabled={isLoading}
            fullWidth
            multiline
            rows={3}
            sx={darkFieldSx}
          />

          {/* Opening / Closing time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField
              label="Opening Time"
              name="opening_time"
              type="time"
              value={formFields.opening_time}
              onChange={onChangeInput}
              disabled={isLoading}
              fullWidth
              sx={darkFieldSx}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Closing Time"
              name="closing_time"
              type="time"
              value={formFields.closing_time}
              onChange={onChangeInput}
              disabled={isLoading}
              fullWidth
              sx={darkFieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          {/* GST / Account number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField
              label="GST Number"
              name="GST_number"
              value={formFields.GST_number}
              onChange={onChangeInput}
              disabled={isLoading}
              fullWidth
              sx={darkFieldSx}
            />
            <TextField
              label="Account Number"
              name="Account_number"
              value={formFields.Account_number}
              onChange={onChangeInput}
              disabled={isLoading}
              fullWidth
              sx={darkFieldSx}
            />
          </div>

          {/* FSSAI certificate */}
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase mb-2">
              FSSAI Certificate
            </span>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-xl overflow-hidden bg-[#292929] border border-white/10 shrink-0 flex items-center justify-center">
                {fssaiPreview ? (
                  <img src={fssaiPreview} alt="FSSAI Certificate" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] text-gray-500 text-center px-1">No file</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                ref={fssaiInputRef}
                className="hidden"
                onChange={onFssaiChange}
              />
              <Button
                type="button"
                variant="outlined"
                startIcon={<FiUpload size={14} />}
                onClick={() => fssaiInputRef.current?.click()}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#ef4444", borderColor: "#ef4444" },
                }}
              >
                {fssaiPreview ? "Change File" : "Upload File"}
              </Button>
            </div>
            {errors.fassai_certificate && (
              <p className="text-red-500 text-xs mt-1">{errors.fassai_certificate}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 mt-3">
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate("/restaurant")}
              disabled={isLoading}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                backgroundColor: "#ef4444",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                flex: 1,
                "&:hover": { backgroundColor: "#dc2626" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Add Restaurant"
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RestaurantForm;