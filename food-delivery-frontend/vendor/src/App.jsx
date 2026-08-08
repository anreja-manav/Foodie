import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import './App.css'
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/Forgot_Password';
import Verify from './pages/Verify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

export const MyContext = React.createContext();

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  const alertBox = (type, msg) => {
      if (type === "success") toast.success(msg);
      if (type === "error") toast.error(msg);
    };

  const values = {
    alertBox,
    isLogin,
    setIsLogin,
    windowWidth,
  }

  return (
    <> 
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <main >
            <Routes>
              <Route path='/' element={<Home />} />
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
