import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import './App.css'
import Register from './pages/Register'
import Verify from './pages/verify';
import Login from './pages/Login';
import ForgotPassword from './pages/reset_password';

export const MyContext = React.createContext();


function App() {


  const [isLogin, setIsLogin] = useState(false);

  const alertBox = (type, msg) => {
    if (type === "success") toast.success(msg);
    if (type === "error") toast.error(msg);
  };

  const values = {
    alertBox,
    isLogin,
    setIsLogin,
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Routes>
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
