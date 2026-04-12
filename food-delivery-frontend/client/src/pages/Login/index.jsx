import {useContext, useEffect, useState} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { MyContext } from "../../App";
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';


const Login = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [formFields, setFormsFields] = useState({
        phone:"",
        password:""
    });

    const context = useContext(MyContext);
    const history = useNavigate();

    // const forgotPassword = () => {

    //     if (formFields.phone===""){
    //         context.alertBox("error","Please enter Phone Number");
    //         return false;
    //     }
    //     else {
    //         context.alertBox("success", `OTP sent to ${formFields.phone}`);
    //         localStorage.setItem("username", formFields.phone);
    //         localStorage.setItem("actionType", "forgot-password");

    //         postData("/api/user/forgot-password", {
    //             phone:formFields.phone,
    //         }).then((res)=>{
    //             if(res?.error===false){
    //                 context.alertBox("success", res?.message);
    //                 history("/verify");
    //             } else {
    //                 context.alertBox("error", res?.message);
    //             }
    //         })
    //     }

    // }

    const onChangeInput = (e) => {
        const {name, value} = e.target;
        setFormsFields(()=>{
            return {
                ...formFields,
                [name]:value
            }
        })
    }

    useEffect(() => {
            window.scrollTo(0, 0)
        }, [])
    

    const valideValue = Object.values(formFields).every(el => el)
    
    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        if(formFields.phone===""){
            context.alertBox("error","Please enter Phone Number")
            return false
        }

        if(formFields.password===""){
            context.alertBox("error","Please enter password")
            return false
        }

        postData("/accounts/login/", formFields, { withCredentials: true }).then((res)=>{

            if(res?.error!==true){
                setIsLoading(false);
                context.alertBox("success", res?.message);
                setFormsFields({
                phone:"",
                password:""
                })

                localStorage.setItem("accessToken", res?.access);
                localStorage.setItem("refreshToken", res?.refresh);

                context.setIsLogin(true);

                // history("/");
            } else {
                context.alertBox("error", res?.message);
                setIsLoading(false);
            }

        })
    }
    

    useEffect(()=>{
        window.scrollTo(0,0)
    },[])

    return (
        <section className='section py-5 sm:py-10 min-h-screen flex items-center justify-center bg-gray-100'>

            <div className="container flex justify-center w-full px-4">
                <div className='card shadow-md w-full sm:w-100 m-auto rounded-md bg-white p-5 sm:p-8 flex flex-col'>

                {/* Heading */}
                <h3 className='text-center text-[16px] sm:text-[18px] font-bold text-black'>
                    Login to your account
                </h3>

                <form className='w-full mt-5 flex flex-col gap-4' onSubmit={handleSubmit}>

                    {/* Phone Number */}
                    <div className='form-group w-full'>
                        <TextField
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formFields.phone || ""}
                            disabled={isLoading}
                            label="Phone Number *"
                            variant="outlined"
                            fullWidth
                            onChange={onChangeInput}
                            inputProps={{ 
                                maxLength: 10,
                                pattern: "[0-9]*" 
                            }}
                        />
                    </div>

                    {/* Password Input */}
                    <div className='form-group w-full relative'>
                    <TextField
                        margin='normal'
                        type={isPasswordShow ? 'text' : 'password'}
                        id="password"
                        label="Password"
                        variant="outlined"
                        className="w-full text-sm sm:text-base"
                        name="password"
                        value={formFields.password}
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

                    {/* Forgot Password */}
                    <a className="link cursor-pointer text-[12px] sm:text-[14px] font-semibold self-end">
                    Forgot Password?
                    </a>

                    {/* Login Button */}
                    <div className='flex items-center w-full mt-3'>
                    <Button
                        type="submit"
                        disabled={!valideValue}
                        className="btn-org btn-lg w-full flex gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                        {isLoading ? <CircularProgress color="inherit" /> : 'Login'}
                    </Button>
                    </div>

                    {/* Sign Up Link */}
                    <p className='text-center text-sm sm:text-[14px]'>
                    Not Registered? <Link className="link font-semibold text-primary" to="/register">Sign Up</Link>
                    </p>

                </form>
                </div>
            </div>
        </section>

    )
}

export default Login;