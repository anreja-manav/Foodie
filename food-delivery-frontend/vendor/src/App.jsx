import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import './App.css'
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/Forgot_Password';
import Verify from './pages/Verify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { fetchDataFromApi } from './utils/api';
import VendorDashboard from './pages/Home';

export const MyContext = React.createContext();

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [vendorData, setVendorData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLogin(true);
      getVendorDetails();
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

  const values = {
    alertBox,
    isLogin,
    setIsLogin,
    windowWidth,
    vendorData,
  }

  return (
    <> 
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <main >
            <Routes>
              <Route path='/' element={<VendorDashboard />} />
              <Route path="/register" element={<Register />} />
              <Route path='/verify' element={<Verify />} />
              <Route path='/login' element={<Login />} />
              <Route path='/forgot_password/confirm' element={<ForgotPassword />} />
            </Routes>
          </main>
        </MyContext.Provider>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App
