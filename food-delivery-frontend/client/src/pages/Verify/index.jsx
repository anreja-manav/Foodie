import React, { useContext, useState } from 'react'
import OtpBox from '../../components/OtpBox'
import Button from '@mui/material/Button';
import { editData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { MyContext } from "../../App";

const Verify = () => {
    const [otp, setOtp] = useState("");
    const handleOtpChange = (value) => {
        setOtp(value);
    };

    const history = useNavigate();
    const context = useContext(MyContext);

    const verifyOTP = (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");

        if (!userId || userId === "undefined") {
            context.alertBox("error", "Session invalid. Please register again.");
            return;
        }

        if (otp.length !== 5) {
            context.alertBox("error", "Please enter all 5 digits.");
            return;
        }

        // URL structure: base_url + accounts/auth/{id}/verify-otp/
        editData(`accounts/${userId}/verify_otp`, {
            otp: otp
        }).then((res) => {
            // Django returns 200 OK for success
            if (res?.error !== true) {
                context.alertBox("success", res.message);
                localStorage.removeItem("userId");
                localStorage.removeItem("username");
                // history("/");
            } else {
                context.alertBox("error", res?.message || "Verification failed");
            }
        });
    };

    const resendOTP = (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");

        if (!userId || userId === "undefined") {
            context.alertBox("error", "Session invalid. Please register again.");
            return;
        }
        editData(`accounts/${userId}/regenerate_otp`, {
            otp: otp
        }).then((res) => {
            if (res?.error !== true) {
                context.alertBox("success", res?.message);
            } else {
                context.alertBox("error", res?.message);
            }
        });
    };

    return (
        <section className='section py-5 sm:py-10'>
  <div className='container flex items-center justify-center'>
    <div className="card shadow-md w-full max-w-150 mx-auto rounded-md bg-white p-8 box-border">
      
      {/* Icon */}
      <div className="text-center flex items-center justify-center">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdjd0u5SbMl2FGC2dNBOCeA6fQi63glaMR2A&s" width="80" alt="OTP Verification" />
      </div>

      {/* Heading */}
      <h3 className='text-center text-[18px] font-semibold text-black mt-4 mb-1'>
        Verify OTP
      </h3>

      {/* OTP Info */}
      <p className="text-center mt-0 mb-4 text-sm">
        OTP sent to{" "}
        <span className="text-primary font-bold">
          {localStorage.getItem("username")}
        </span>
      </p>

      {/* OTP Form */}
      <form onSubmit={verifyOTP}>
        <OtpBox length={5} onChange={handleOtpChange} />

        <div className="flex items-center justify-center pt-5 px-3 pb-3">
          <Button type="submit" className="w-full btn-org btn-lg">
            Verify OTP
          </Button>
        </div>
      </form>
        <div className="flex items-center justify-center px-3 pb-5">
          <Button type="submit" className="w-full bg-[#4e73df]! text-white! text-[14px]! py-20px! px-10px!" onClick={resendOTP}>
            Resend OTP
          </Button>
        </div>

    </div>
  </div>
</section>

    )
}

export default Verify
