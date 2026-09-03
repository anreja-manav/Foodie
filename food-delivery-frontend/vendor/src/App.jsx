import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import './App.css'
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/Forgot_Password';
import Verify from './pages/Verify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { fetchDataFromApi } from './utils/api';
import RestaurantDetailsForm from './pages/RestaurantDetailsForm/inedx';
import HomePage from './pages/Home';
import Orders from './pages/Orders';
import Layout from './components/Layout';

export const MyContext = React.createContext();

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [vendorData, setVendorData] = useState(null);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLogin(true);
      getVendorDetails();
      getRestaurantDetails();
      getCategories();
      getDishes();
      getOrders();
      getPopularDishes();
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  const alertBox = (type, msg) => {
      if (type === "success") toast.success(msg);
      if (type === "error") toast.error(msg);
    };

  // Function for Vendor Data
  const getVendorDetails = () => {
    fetchDataFromApi(`accounts/vendor/profile`).then((res) => {
      if (res?.error === false){
        setVendorData(res?.data);
        localStorage.setItem("userId", res.data.id);
      } else{
        alertBox("error", "Your session is closed please login again");
        window.location.href = "/login";
        setIsLogin(false);
      }
    });
  };

  // Get Restaurant Details
  const getRestaurantDetails = () => {
    fetchDataFromApi('/restaurants/').then((res) => {
      setRestaurantDetails(res);
    })
  }

  // get categories
  const getCategories = () => {
    fetchDataFromApi("/restaurants/categories").then((res) => {
      if (res?.error !== false) {
        alertBox("error", "Something went wrong");
        return false;
      }
      setCategories(res?.data);
    });
  }

  // Get Dishes
  const getDishes = () => {
    fetchDataFromApi('restaurants/my_menu').then((res) => {
      if (res?.error !== false){
        alertBox("error", res?.message);
        return false;
      }
      setDishes(res?.data);
    })
  }

  const getPopularDishes = () => {
    fetchDataFromApi('restaurants/popular_products').then((res) =>{
      if (res?.error != false){
        alertBox("error", res?.message);
        return
      }
      setPopularDishes(res?.data);
    })
  }

  // Get Orders
  const getOrders = () => {
    fetchDataFromApi('restaurants/orders').then((res) => {
      if (res?.error !== false){
        alertBox("error", res?.message);
        return false;
      }
      setOrders(res?.data);
    })
  }
  const values = {
    alertBox,
    isLogin,
    setIsLogin,
    windowWidth,
    vendorData,
    setVendorData,
    restaurantDetails,
    setRestaurantDetails,
    categories,
    setCategories,
    getCategories,
    dishes,
    setDishes,
    getDishes,
    orders,
    setOrders,
    getOrders,
    popularDishes,
    setPopularDishes,
    getPopularDishes,
  }

  return (
    <> 
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <main>
            <Routes>
              {/* Auth pages: no sidebar */}
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/forgot_password/confirm" element={<ForgotPassword />} />

              {/* Pages that share the sidebar */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage vendor={vendorData} />} />
                <Route path="/restaurant" element={<RestaurantDetailsForm />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>
          </main>
        </MyContext.Provider>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App;