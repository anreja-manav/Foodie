import {useContext, useEffect, useState} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { MyContext } from "../../App";
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';
import { darkFieldSx } from '../../utils/muiDarkStyles';


const Login = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [formFields, setFormsFields] = useState({
        phone:"",
        password:""
    });

    const context = useContext(MyContext);
    const history = useNavigate();

    const forgotPassword = () => {

        if (formFields.phone===""){
            context.alertBox("error","Please enter Phone Number");
            return false;
        }

        postData("/accounts/forgot_password/", {
            phone:formFields.phone,
        }).then((res)=>{
            if(res?.error===false){
                context.alertBox("success", res?.message);
                localStorage.setItem("userId", res?.user_id);
                localStorage.setItem("action", "forgot_password");
                localStorage.setItem("username", formFields.phone )
                history("/verify");
            } else {
                context.alertBox("error", res?.message);
            }
        })
    }

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

        postData("/accounts/login/vendor", formFields, { withCredentials: true }).then((res)=>{
            if(res?.error!==true){
                setIsLoading(false);
                context.alertBox("success", res?.message);
                setFormsFields({
                phone:"",
                password:""
                })
                localStorage.setItem("accessToken", res?.access);
                localStorage.setItem("refreshToken", res?.refresh);
                localStorage.setItem("userId", res?.user_id);
                context.setIsLogin(true);
                history("/");
            } else {
                context.alertBox("error", res?.message);
                setIsLoading(false);
            }
        })
    }

    return (
        <section className='py-5 sm:py-10 h-full w-full flex items-center justify-center bg-[#0d0d0d]'>

            <div className="container flex justify-center w-full px-4">
                <div className='w-full sm:w-100 m-auto rounded-2xl bg-[#1a1a1a] border border-white/10 p-5 sm:p-8 flex flex-col shadow-2xl'>

                <h3 className='text-center text-[16px] sm:text-[18px] font-bold text-white'>
                    Login to your account
                </h3>

                <form className='w-full mt-5 flex flex-col gap-4' onSubmit={handleSubmit}>

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
                            sx={darkFieldSx}
                            onChange={onChangeInput}
                            inputProps={{ 
                                maxLength: 10,
                                pattern: "[0-9]*" 
                            }}
                        />
                    </div>

                    <div className='form-group w-full relative'>
                    <TextField
                        margin='normal'
                        type={isPasswordShow ? 'text' : 'password'}
                        id="password"
                        label="Password"
                        variant="outlined"
                        className="w-full text-sm sm:text-base"
                        sx={darkFieldSx}
                        name="password"
                        value={formFields.password}
                        disabled={isLoading}
                        onChange={onChangeInput}
                    />
                    <Button
                        type="button"
                        className="absolute! top-1/2 -translate-y-1/2 right-2 sm:right-3 z-50 w-7.5! h-7.5! min-w-7.5! rounded-full! text-gray-400! p-0"
                        onClick={() => setIsPasswordShow(!isPasswordShow)}
                    >
                        {isPasswordShow ? 
                        <IoMdEyeOff className="text-[18px] sm:text-[20px] opacity-75" /> : 
                        <IoMdEye className="text-[18px] sm:text-[20px] opacity-75" />
                        }
                    </Button>
                    </div>

                    <a className="cursor-pointer text-[12px] sm:text-[14px] font-semibold self-end text-red-500 hover:text-red-400" onClick={forgotPassword}>
                    Forgot Password?
                    </a>

                    <div className='flex items-center w-full mt-3'>
                    <Button
                        type="submit"
                        disabled={!valideValue}
                        className="w-full! flex! gap-2! sm:gap-3! text-sm! sm:text-base! bg-red-500! hover:bg-red-600! disabled:bg-[#333]! text-white! py-3! rounded-2xl! normal-case!"
                    >
                        {isLoading ? <CircularProgress color="inherit" size={22} /> : 'Login'}
                    </Button>
                    </div>

                    <p className='text-center text-sm sm:text-[14px] text-gray-400'>
                    Not Registered? <Link className="font-semibold text-red-500 hover:text-red-400" to="/register">Sign Up</Link>
                    </p>

                </form>
                </div>
            </div>
        </section>
    )
}

export default Login;