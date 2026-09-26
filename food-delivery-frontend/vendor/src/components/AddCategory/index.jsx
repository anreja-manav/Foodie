import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../App";
import { Button } from "@mui/material";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { postData } from "../../utils/api";

const inputClasses =
  "w-full rounded-xl bg-[#1a1a1a] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#ef4444] transition-colors";
const labelClasses = "block text-xs font-semibold text-gray-400 mb-1.5 py-2";


const AddCategory = ({ onClose, onCategoryAdded }) => {
  const context = useContext(MyContext);

  const [name, setName] = useState("");
  const [picFile, setPicFile] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const picInputRef = useRef(null);

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

  const onPicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
    setError("");
  };

  const clearPic = () => {
    setPicFile(null);
    setPicPreview(null);
    if (picInputRef.current) picInputRef.current.value = "";
  };

  const handleAddCategory = async () => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    if (!picFile) {
      setError("Category image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("image", picFile);

    setIsLoading(true);
    try {
      const response = await postData("restaurants/categories/create", formData);

      if (response?.error === true) {
        context?.alertBox(
          "error",
            response.message
            || "Could not add category"
        );
        setIsLoading(false);
        return;
      }

      await context?.getCategories?.();
      context?.alertBox("success", "Category added");
      onCategoryAdded?.(response?.data);
      onClose?.();
    } catch {
      context?.alertBox("error", "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

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
        aria-label="Add category"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d0d] p-5 sm:p-6"
      >
        <div className="flex items-center justify-between mb-5 pb-2">
          <h2 className="text-lg font-bold text-white">Add Category</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141414] p-4 sm:p-5 space-y-4">
          {/* Image */}
          <div>
            <label className={labelClasses}>Category image</label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10 flex items-center justify-center shrink-0">
                {picPreview ? (
                  <img src={picPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <FiUploadCloud className="text-gray-600" size={20} />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <label
                  htmlFor="category-image"
                  className="cursor-pointer rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2 text-sm text-gray-300 hover:bg-[#222] transition-colors"
                >
                  {picPreview ? "Change image" : "Upload image"}
                </label>
                <input
                  id="category-image"
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
                    aria-label="Remove image"
                  >
                    <FiX size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className={labelClasses}>Category name</label>
            <input
              type="text"
              placeholder="e.g. Starters"
              className={inputClasses}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="mt-5 flex items-center justify-end gap-3 py-3">
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
            type="button"
            variant="contained"
            disabled={isLoading}
            onClick={handleAddCategory}
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
            {isLoading ? "Adding..." : "Add category"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;