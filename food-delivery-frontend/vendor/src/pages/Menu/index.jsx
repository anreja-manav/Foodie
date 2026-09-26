import React, { useContext, useState, useEffect} from "react";
import { MyContext } from "../../App";
import NotLogin from "../../components/notLogin";
import VendorNotVerifiedDashboard from "../../components/VendorNotVerified";
import { FiEdit2, FiStar } from "react-icons/fi";
import { Button, Switch } from "@mui/material";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import EditProduct from "../../components/EditProduct";



const Menu = () => {
  
  const context = useContext(MyContext);
  const vendor = context?.vendorData;
  const [categories, setCategories] = useState([]);
  const BaseURL = import.meta.env.VITE_API_URL;

  const [openCategories, setOpenCategories] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);``

  useEffect(() =>{
    getCategoryProducts();
  }, [context?.restaurantDetails?.id])

  const getCategoryProducts = () => {
    
    fetchDataFromApi(`/restaurants/${context?.restaurantDetails?.id}/`).then((res) => {
        setCategories(res.categories);
        if (res?.categories?.length) {
          const firstKey = res.categories[0]?.id ?? 0;
          setOpenCategories({ [firstKey]: true });
        }
      });
  }

  const deleteProduct = (product) => {
    deleteData(`/restaurants/products/${product}/delete`).then((res) => {
      if (res?.error === false){
        context.alertBox('success', 'Dish Removed From Menu');
        getCategoryProducts();
      }else{
        context.alertBox('error', res?.message);
      }
    })
  }



  const toggleAvailability = (product, next) => {
    editData(`restaurants/products/${product}/update/availability`, {'is_available': next}).then((res) => {
      if (res?.error === false) {
        context?.alertBox("success", next ? "Marked available" : "Marked unavailable");
        getCategoryProducts();
      } else {
        context?.alertBox("error", res?.message || "Something went wrong");
      }
    });
  };

  const toggleCategory = (key) => {
    setOpenCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (vendor === null) return <NotLogin />;
  if (vendor?.vendor_profile?.is_verified === false) return <VendorNotVerifiedDashboard />;

  return (
    <div className="h-full w-full overflow-y-auto bg-[#0d0d0d] px-8 py-6">

      <Header />
      <div className="flex justify-between py-4 my-5">
        <h1 className="text-2xl font-bold text-white  ">Menu</h1>
        <Link to="/restaurant/menu/add">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#ef4444',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  '&:hover': { backgroundColor: '#dc2626' },
                }}
              >
                Add Product
              </Button>
            </Link>
      </div>
      {categories.length === 0 ? (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
          <p className="text-gray-400 text-sm">No products added yet.</p>
        </div>
      ) : (
        categories.map((category, index) => {
          const key = category.id ?? index;
          const isOpen = !!openCategories[key];
          const itemCount = category.products?.length ?? category.item_count ?? 0;

          return (
            <div key={key} className="mb-2 border-b border-white/10">

              {/* Category header - click to expand/collapse */}
              <button
                type="button"
                onClick={() => toggleCategory(key)}
                className="flex items-center justify-between w-full py-4 text-left"
              >
                <span className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white uppercase tracking-wide">
                    {category.name}
                  </h2>
                  <span className="text-xs text-gray-500">
                    ({itemCount})
                  </span>
                </span>

                <IoIosArrowDown
                  className={`text-gray-400 transition-transform duration-300 ease-in-out ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Collapsible product grid */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-5">
                  {category.products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-2xl bg-[#1a1a1a] border border-white/10 p-4 flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative h-32 w-full rounded-xl overflow-hidden bg-[#292929] mb-3">
                        {product.image && (
                          <img
                            src={`${BaseURL}${product.image}`}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                        {product.is_bestseller && (
                          <span className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                            BESTSELLER
                          </span>
                        )}
                        <span
                          className={`absolute top-2 right-2 h-4 w-4 rounded-sm border-2 flex items-center justify-center ${
                            product.food_type === "VEG"
                              ? "border-green-500"
                              : "border-red-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.food_type === "VEG" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                        </span>
                      </div>

                      {/* Name */}
                      <div className="flex justify-between pt-2">
                        <h3 className="text-sm font-semibold text-white truncate ">
                          {product.name}
                        </h3>
                        <button
                          type="button"
                          aria-label="Delete product"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#292929] text-gray-300 hover:bg-[#333] hover:text-white"
                          onClick={()=>{deleteProduct(product.id)}}
                        >
                          <MdDeleteOutline size={12} />
                        </button>
                      </div>

                      {/* Description + Size*/}
                      {product.description && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {product.description} {product.size && <span>({product.size})</span>}
                        </p>
                      )}

                      {/* Price row */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-base font-bold text-white">
                          ₹{product.price}
                        </span>
                        {product.old_price && Number(product.old_price) > Number(product.price) && (
                          <>
                            <span className="text-xs text-gray-500 line-through">
                              ₹{product.old_price}
                            </span>
                            <span className="text-xs font-semibold text-green-500">
                              {product.savings_percentage}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* Rating + prep time */}
                      <div className="py-2 flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1 text-yellow-400">
                          <FiStar size={12} className="fill-current" />
                          {product.rating}
                        </span>
                        <span>{product.preparation_time} min</span>
                      </div>

                      {/* Footer: availability + edit */}
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Switch
                            size="small"
                            checked={!!product.is_available}
                            onChange={(e) => toggleAvailability(product.id, e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': { color: '#ef4444' },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#ef4444' },
                              '& .MuiSwitch-track': { backgroundColor: '#3a3a3a' },
                            }}
                          />
                          <span className="text-xs text-gray-400">
                            {product.is_available ? "Available" : "Unavailable"}
                          </span>
                        </div>

                            <button
                              type="button"
                              aria-label="Edit product"
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#292929] text-gray-300 hover:bg-[#333] hover:text-white"
                              onClick={() => setEditingProduct(product)}
                            >
                              <FiEdit2 size={12} />
                            </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
      {editingProduct && (
        <EditProduct
          key={editingProduct.id}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          getCategoryProducts={getCategoryProducts}
        />
      )}
    </div>
  );
};

export default Menu;