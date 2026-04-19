import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import './App.css'
import Register from './pages/Register'
import Verify from './pages/verify';
import Login from './pages/Login';
import ForgotPassword from './pages/reset_password';
import Header from './components/Header';
import { fetchDataFromApi } from './utils/api';
import Home from './pages/Home';

export const MyContext = React.createContext();


function App() {


  const [isLogin, setIsLogin] = useState(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [userData, setUserData] = useState(null);
  const [catData, setCatData] = React.useState([]);
  const [cat, setCat] = React.useState([]);


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    getCat();
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLogin(true);
      getUserDetails();
    } else {
      setIsLogin(false);
      setUserData(null);
    }
  }, [isLogin]);


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


  const getCat = () => {
    fetchDataFromApi("/restaurants/categories").then((res) => {
      if (res?.error !== false) {
        alertBox("error", "Something went wrong");
        return false;
      }
      setCat(res?.data);
    });
  }


  const alertBox = (type, msg) => {
    if (type === "success") toast.success(msg);
    if (type === "error") toast.error(msg);
  };

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
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgot_password/confirm' element={<ForgotPassword />} />
          </Routes>
        </MyContext.Provider>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App
