import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../App";
import { Button, Switch } from "@mui/material";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { editData } from "../../utils/api";

const FOOD_TYPES = [
  { value: "VEG", label: "Vegetarian" },
  { value: "NON-VEG", label: "Non-Vegetarian" },
  { value: "EGG", label: "Contains Egg" },
];

const inputClasses =
  "w-full rounded-xl bg-[#1a1a1a] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#ef4444] transition-colors";
const labelClasses = "block text-xs font-semibold text-gray-400 pb-1.5";
const switchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: "#ef4444" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#ef4444" },
  "& .MuiSwitch-track": { backgroundColor: "#3a3a3a" },
};

// Turn the product item into form state
const buildFields = (p) => ({
  name: p?.name ?? "",
  description: p?.description ?? "",
  category: String(p?.category?.id ?? p?.category ?? ""),
  price: p?.price ?? "",
  old_price: p?.old_price ?? "",
  food_type: p?.food_type ?? "VEG",
  preparation_time: p?.preparation_time ?? 20,
  is_available: !!p?.is_available,
  is_bestseller: !!p?.is_bestseller,
});

const EditProduct = ({ product, onClose, onUpdated, getCategoryProducts}) => {
  const context = useContext(MyContext);
  const BaseURL = import.meta.env.VITE_API_URL;

  const [formFields, setFormFields] = useState(() => buildFields(product));
  const initialFields = useRef(buildFields(product)).current;
  const existingImage = product?.image || null;

  const [picFile, setPicFile] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const picInputRef = useRef(null);
  const categories = context?.categories || [];

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !isLoading && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLoading, onClose]);

  useEffect(() => {
    return () => {
      if (picPreview) URL.revokeObjectURL(picPreview);
    };
  }, [picPreview]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSwitchChange = (name, checked) => {
    setFormFields((prev) => ({ ...prev, [name]: checked }));
  };

  const onPicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const clearPic = () => {
    setPicFile(null);
    setPicPreview(null);
    if (picInputRef.current) picInputRef.current.value = "";
  };

  const validate = () => {
    const newErrors = {};
    if (!formFields.name) newErrors.name = "Required";
    if (!formFields.description) newErrors.description = "Required";
    if (!formFields.category) newErrors.category = "Required";
    if (!formFields.price) newErrors.price = "Required";
    if (
      formFields.old_price &&
      Number(formFields.old_price) <= Number(formFields.price)
    ) {
      newErrors.old_price = "Old price must be higher than current price";
    }
    if (!picFile && !existingImage) newErrors.image = "Dish photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    let hasChanges = false;

    Object.keys(formFields).forEach((key) => {
      if (String(formFields[key]) !== String(initialFields[key])) {
        if (key === "old_price" && formFields.old_price === "") return;
        formData.append(key, formFields[key]);
        hasChanges = true;
      }
    });

    if (picFile) {
      formData.append("image", picFile);
      hasChanges = true;
    }

    if (!hasChanges) {
      context?.alertBox("error", "No changes to save");
      return;
    }

    setIsLoading(true);
    editData(`restaurants/products/${product.id}/update`, formData)
      .then((res) => {
        setIsLoading(false);
        if (res?.error !== true) {
          context?.alertBox("success", res?.message || "Product updated");
          getCategoryProducts();
          onUpdated?.(res?.data);
          onClose?.();
        } else {
          const msg =
            typeof res?.message === "string"
              ? res.message
              : JSON.stringify(res?.message);
          context?.alertBox("error", msg);
        }
      })
      .catch(() => {
        setIsLoading(false);
        context?.alertBox("error", "Something went wrong. Please try again.");
      });
  };
  const existingImageSrc = existingImage ? `${BaseURL}${existingImage}` : null;
  const shownImage = picPreview || existingImageSrc;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit product"
        className="w-full max-w-3xl max-h-full overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d0d] p-6"
      >
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-xl font-bold text-white">Edit Product</h1>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-5">
            {/* Image */}
            <div>
              <label className={labelClasses}>Product image</label>
              <div className="flex items-center gap-4 py-3">
                <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10 flex items-center justify-center shrink-0">
                  {shownImage ? (
                    <img src={shownImage} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <FiUploadCloud className="text-gray-600" size={24} />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="edit-product-image"
                    className="cursor-pointer rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2 text-sm text-gray-300 hover:bg-[#222] transition-colors"
                  >
                    {shownImage ? "Change image" : "Upload image"}
                  </label>
                  <input
                    id="edit-product-image"
                    ref={picInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPicChange}
                  />
                  {picPreview && (
                    <button
                      type="button"
                      onClick={clearPic}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] border border-white/10 text-gray-400 hover:text-white"
                      aria-label="Discard new image"
                      title="Discard new image"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              </div>
              {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
            </div>

            {/* Name + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 m-3">
              <div>
                <label className={labelClasses}>Product name</label>
                <input
                  type="text"
                  name="name"
                  className={inputClasses}
                  placeholder="e.g. Paneer Butter Masala"
                  value={formFields.name}
                  onChange={onChangeInput}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className={labelClasses}>Category</label>
                <select
                  name="category"
                  className={inputClasses}
                  value={formFields.category}
                  onChange={onChangeInput}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClasses}>Description</label>
              <textarea
                rows={3}
                name="description"
                className={inputClasses}
                placeholder="Short description shown to customers"
                value={formFields.description}
                onChange={onChangeInput}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Price + Old price + Food type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3">
              <div>
                <label className={labelClasses}>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  className={inputClasses}
                  placeholder="199"
                  value={formFields.price}
                  onChange={onChangeInput}
                />
                {errors.price && <p className="pt-1 text-xs text-red-500">{errors.price}</p>}
              </div>

              <div>
                <label className={labelClasses}>Old price (optional)</label>
                <input
                  type="number"
                  name="old_price"
                  min="0"
                  step="0.01"
                  className={inputClasses}
                  placeholder="249"
                  value={formFields.old_price}
                  onChange={onChangeInput}
                />
                {errors.old_price && (
                  <p className="mt-1 text-xs text-red-500">{errors.old_price}</p>
                )}
              </div>

              <div>
                <label className={labelClasses}>Food type</label>
                <select
                  name="food_type"
                  className={inputClasses}
                  value={formFields.food_type}
                  onChange={onChangeInput}
                >
                  {FOOD_TYPES.map((ft) => (
                    <option key={ft.value} value={ft.value}>
                      {ft.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prep time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3">
              <div>
                <label className={labelClasses}>Preparation time (mins)</label>
                <input
                  type="number"
                  name="preparation_time"
                  min="1"
                  className={inputClasses}
                  value={formFields.preparation_time}
                  onChange={onChangeInput}
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-8 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-4">
              <div className="flex items-center gap-2">
                <Switch
                  size="small"
                  checked={formFields.is_available}
                  onChange={(e) => onSwitchChange("is_available", e.target.checked)}
                  sx={switchSx}
                />
                <span className="text-sm text-gray-300">Available</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  size="small"
                  checked={formFields.is_bestseller}
                  onChange={(e) => onSwitchChange("is_bestseller", e.target.checked)}
                  sx={switchSx}
                />
                <span className="text-sm text-gray-300">Bestseller</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              sx={{
                color: "#9ca3af",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
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
                py: 1.2,
                "&:hover": { backgroundColor: "#dc2626" },
                "&.Mui-disabled": { backgroundColor: "#7f1d1d", color: "#d1d5db" },
              }}
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;