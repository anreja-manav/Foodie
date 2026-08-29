import React from 'react'
import { Link } from "react-router-dom";

const NotLogin = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full gap-7 text-sm md:text-xl lg:text-2xl">
        <span>You're not login. Please login first</span>
        <Link to = 'login'>
            <button
                type="button"
                className=" bg-orange-600 text-white hover:cursor-pointer h-8 md:h-10 lg:h-15 w-25 md:w-30 lg:w-40 "
            >
                Login
            </button>
        </Link>
    </div>
  )
}

export default NotLogin
