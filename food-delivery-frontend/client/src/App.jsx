import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import './App.css'
import Register from './pages/Register'
import Verify from './pages/verify';
import Login from './pages/Login';
import ForgotPassword from './pages/reset_password';
import Header from './components/Header';
import { fetchDataFromApi, postData } from './utils/api';
import Home from './pages/Home';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';
import CartPage from "./pages/Cart/index.jsx";
import RestaurantDetail from './pages/RestaurantDetails';
import Breadcrumbs from './components/Breadcrumbs';
import RestaurantsList from './components/RestaurantsList';
import DishDetailsDialog from './components/ItemDetailDialog';

export const MyContext = React.createContext();


function App() {

  // States
  const [isLogin, setIsLogin] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userData, setUserData] = useState(null);
  const [catData, setCatData] = useState([]);
  const [cat, setCat] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [formFields, setFormFields] = useState({
    city: "Narnaul"
  });

  const [openLocationPanel, setOpenLocationPanel] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [openSearchPanel, setOpenSearchPanel] = useState(false);
  const [openDishDetailsModal, setOpenDishDetailsModal] = useState({
    open: false,
    item: {}
  });


  const toggleLocationPanel = (newOpen) => {
    setOpenLocationPanel(newOpen);
  };

  const handleOpenDishDetailsModal = (status, item) => {
    setOpenDishDetailsModal({
      open: status,
      item: item
    });
  };

  const handleCloseDishDetailsModal = () => {
    setOpenDishDetailsModal({
      open: false,
      item: {}
    });
  };

  
  // UseEffect to get default address city
  useEffect(() => {
    const defaultCity = userData?.Addresses?.find(addr => addr.is_default === true)?.city;
    if (defaultCity) {
        setFormFields(prev => ({ ...prev, city: defaultCity }));
    }
  }, [userData]);

  // useEffect to hit restaurant api after changing the city
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        getRestaurants();
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [formFields.city]);
  
  // UseEffect to handle responsive window
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // useEffect to see if user login or not
  useEffect(() => {
    getCat();
    getRestaurants();
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLogin(true);
      getUserDetails();
      getCartItems();
    } else {
      setIsLogin(false);
      setUserData(null);
    }
  }, [isLogin]);


  // UseEffect to get user's detail
  const getUserDetails = () => {
    fetchDataFromApi(`accounts/customer/profile`).then((res) => {
      setUserData(res);
      localStorage.setItem("userId", res.ID);

      if (res?.response?.data?.error === true) {
        if (res?.response?.data?.message === "You have not login") {
          localStorage.removeItem("accessToken");
          alertBox("error", "Your session is closed please login again");
          window.location.href = "/login";
          setIsLogin(false);
        }
      }
    });
  };
  // useEffect for cart details
  useEffect(()=>{

  })
  // Get Restaurants Function
  const getRestaurants = () => {
    fetchDataFromApi(`/restaurants/${formFields.city}`).then((res) => {
      if (res?.error !== false) {
        alertBox("error", "Something went wrong");
        return false;
      }
      setRestaurants(res?.data);
    });  
  }

  // Function: Get Category
  const getCat = () => {
    fetchDataFromApi("/restaurants/categories").then((res) => {
      if (res?.error !== false) {
        alertBox("error", "Something went wrong");
        return false;
      }
      setCat(res?.data);
    });
  }

  const getCartItems = () => {
    fetchDataFromApi(`/cart/my_cart`).then((res) => {
      console.log(res.data?.items);
      if (res?.error === false) setCartData(res?.data?.items);
    });
  };


  // Alertbox
  const alertBox = (type, msg) => {
    if (type === "success") toast.success(msg);
    if (type === "error") toast.error(msg);
  };

  // add to cart
  const addToCart = (productId, quantity) => {
    const data = {
      "product_id": productId,
      "quantity": quantity
    }
    postData('/cart/add_item', data).then((res) => {
      if (res?.error === false) {
        alertBox('success', res?.message);
        getCartItems();
      } else {
        alertBox("error", "Something is wrong. Try again later");
      }
    });
  }

  

  // Values to pass in MyContext
  const values = {
    alertBox,
    isLogin,
    setIsLogin,
    windowWidth,
    userData,
    setUserData,
    getUserDetails,
    cat,
    setCat,
    catData,
    setCatData,
    restaurants,
    formFields,
    setFormFields,
    openLocationPanel,
    setOpenLocationPanel,
    toggleLocationPanel,
    windowWidth,
    searchData,
    setSearchData,
    setOpenSearchPanel,
    openSearchPanel,
    openDishDetailsModal,
    setOpenDishDetailsModal,
    handleCloseDishDetailsModal,
    handleOpenDishDetailsModal,
    cartData,
    setCartData,
    getCartItems,
    addToCart,
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <main >
          <Breadcrumbs />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgot_password/confirm' element={<ForgotPassword />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/restaurants" element={<RestaurantsList />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
          </main>
          <Footer />
          <DishDetailsDialog />
        </MyContext.Provider>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App
