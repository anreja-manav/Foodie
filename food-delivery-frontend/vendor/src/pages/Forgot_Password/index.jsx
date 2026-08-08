import {useContext, useState} from 'react'
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { MyContext } from "../../App";
import CircularProgress from '@mui/material/CircularProgress';
import { editData } from '../../utils/api';

const ForgotPassword = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isPasswordShow2, setIsPasswordShow2] = useState(false);
    
    const [formFields, setFormsFields] = useState({
            otp: localStorage.getItem("otp"),
            new_password:"",
            password_confirm:""
        });

    const context = useContext(MyContext);
    const history = useNavigate();


    const onChangeInput = (e) => {
        const {name, value} = e.target;
        setFormsFields(()=>{
            return {
                ...formFields,
                [name]:value
            }
        })
    }

    const valideValue = Object.values(formFields).every(el => el)

    const handleSubmit = (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        const currentOtp = localStorage.getItem("otp");

        if (!userId || !currentOtp) {
            context.alertBox("error", "Session expired. Please verify OTP again.");
            history("/verify");
            return;
        }
        if (formFields.new_password === "") {
            context.alertBox("error", "Please enter password")
            return false
        }

        if (formFields.password_confirm === "") {
            context.alertBox("error", "Please enter Confirm password")
            return false
        }

        if (formFields.new_password.length < 8){
            context.alertBox("error", "Password lenght must be greater than 8");
            return false;
        }

        if (formFields.new_password !== formFields.password_confirm){
            context.alertBox("error", "New Password and Confirm Password must match");
            return false;
        }
        

        setIsLoading(true);

        const payload = {
            ...formFields,
            otp: currentOtp 
        };
        editData(`/accounts/forgot_password/${userId}/confirm/`, payload).then((res) => {
            setIsLoading(false);
            if (res?.error !== true) {
                localStorage.removeItem("username");
                localStorage.removeItem("action");
                localStorage.removeItem("userId");
                localStorage.removeItem("otp"); 
                context.alertBox("success", res?.message || "Password changed successfully");
                history("/login");
            } else {
                context.alertBox("error", res?.message || "Failed to update password");
            }
        }).catch(err => {
            setIsLoading(false);
            context.alertBox("error", "Server error. Please try again later.");
        });
    };


    return (
        <section className='section py-5 sm:py-8 lg:py-10 min-h-screen flex items-center justify-center bg-gray-100'>

            <div className='container flex items-center justify-center w-full px-4'>
                <div className='card shadow-md w-full sm:w-100 m-auto rounded-md bg-white p-5 sm:p-8 flex flex-col'>

                {/* Heading */}
                <h3 className='text-center text-[16px] sm:text-[18px] font-bold text-black'>
                    Forgot Password
                </h3>

                <form className='w-full mt-5 flex flex-col gap-4' onSubmit={handleSubmit}>

                    {/* New Password */}
                    <div className='form-group w-full relative'>
                    <TextField
                        margin='normal'
                        type={isPasswordShow ? 'text' : 'password'}
                        id="password"
                        label="New Password"
                        variant="outlined"
                        className="w-full text-sm sm:text-base"
                        name="new_password"
                        value={formFields.new_password}
                        disabled={isLoading}
                        onChange={onChangeInput}
                    />
                    <Button
                        type="button"
                        className="absolute! top-1/2 -translate-y-1/2 right-2 sm:right-3 z-50 w-7.5! h-7.5! min-w-7.5! rounded-full! text-black! p-0"
                        onClick={() => setIsPasswordShow(!isPasswordShow)}
                    >
                        {isPasswordShow ? 
                        <IoMdEyeOff className="text-[18px] sm:text-[20px] opacity-75" /> : 
                        <IoMdEye className="text-[18px] sm:text-[20px] opacity-75" />
                        }
                    </Button>
                    </div>

                    {/* Confirm Password */}
                    <div className='form-group w-full relative'>
                    <TextField
                        margin='normal'
                        type={isPasswordShow2 ? 'text' : 'password'}
                        id="confirm_password"
                        label="Confirm Password"
                        variant="outlined"
                        className="w-full text-sm sm:text-base"
                        name="password_confirm"
                        value={formFields.password_confirm}
                        disabled={isLoading}
                        onChange={onChangeInput}
                    />
                    <Button
                        type="button"
                        className="absolute! top-1/2 -translate-y-1/2 right-2 sm:right-3 z-50 w-7.5! h-7.5! min-w-7.5! rounded-full! text-black! p-0"
                        onClick={() => setIsPasswordShow2(!isPasswordShow2)}
                    >
                        {isPasswordShow2 ? 
                        <IoMdEyeOff className="text-[18px] sm:text-[20px] opacity-75" /> : 
                        <IoMdEye className="text-[18px] sm:text-[20px] opacity-75" />
                        }
                    </Button>
                    </div>

                    {/* Submit Button */}
                    <div className='flex items-center w-full mt-3'>
                    <Button
                        type="submit"
                        disabled={!valideValue}
                        className="btn-org btn-lg w-full flex gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                        {isLoading ? <CircularProgress color="inherit" /> : 'Change Password'}
                    </Button>
                    </div>

                </form>                
                </div>
            </div>
        </section>

    )
}

export default ForgotPassword;