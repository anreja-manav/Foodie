import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import './App.css'
import { fetchDataFromApi } from './utils/api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login'
import ForgotPassword from './pages/Forgot_Password';
import Verify from './pages/Verify';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import { MyContext } from "./context/MyContext";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [adminData, setAdminData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);


  const alertBox = (type, msg) => {
      if (type === "success") toast.success(msg);
      if (type === "error") toast.error(msg);
    };

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  };

  const getAdminDetails = async () => {
    try {
      const res = await fetchDataFromApi("/accounts/admin/profile");
      if (res?.error === false) {
        setAdminData(res.data);
        setIsLogin(true);
        localStorage.setItem("userId", res.data.id);
        return true;
      }
      throw new Error("Profile error");
    } catch (err) {
      clearAuth();            // this is what breaks the loop
      setAdminData(null);
      setIsLogin(false);
      return false;
    }
  };

  const getCategories = async () => {
    try {
      const res = await fetchDataFromApi("/restaurants/categories");
      if (res?.error === true) {
        alertBox("error", res?.message || "Failed to load categories");
        return;
      }
      setCategories(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    }
  };
  const init = async () => {
    if (localStorage.getItem("accessToken")) {
      const ok = await getAdminDetails();
      if (ok) await getCategories();
    }
    setAuthLoading(false);
  };
  useEffect(() => {
    
    init();
  }, []);

  const values = {
    alertBox,
    isLogin,
    setIsLogin,
    windowWidth,
    adminData,
    setAdminData,
    categories,
    setCategories,
    getCategories,
    getAdminDetails,
    authLoading,
    setAuthLoading
  };


  return (
    <> 
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <main>
            <Routes>
              {/* Auth pages: no sidebar */}
              

              {/* Pages that share the sidebar */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage admin={adminData} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify" element={<Verify />} />
              <Route path="/forgot_password/confirm" element={<ForgotPassword />} />
              </Route>
            </Routes>
          </main>
        </MyContext.Provider>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App
