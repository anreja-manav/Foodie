import React, { useContext, useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import Stack from "@mui/material/Stack";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { darkFieldSx } from "../../utils/muiDarkStyles";


const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        password2: ""
    });

    const context = useContext(MyContext);
    const history = useNavigate();

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value
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

        if (formFields.name === "") {
            context.alertBox("error", "Please enter full name")
            return false
        }
        if (formFields.email === "") {
            context.alertBox("error", "Please enter full name")
            return false
        }
        if (formFields.phone === "") {
            context.alertBox("error", "Please enter Phone Number")
            return false
        }
        if (formFields.password === "") {
            context.alertBox("error", "Please enter password")
            return false
        }
        if (formFields.password2 === "") {
            context.alertBox("error", "Please enter Confirm password")
            return false
        }

        postData("accounts/register/vendor", formFields).then((res) => {
            if (res?.error !== true) {
                setIsLoading(false);
                context.alertBox("success", res?.message);
                localStorage.setItem("userId", res.data.id); 
                localStorage.setItem("username", formFields.phone);

                setFormFields({
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    password2: ""
                });
                history("/verify");
            } else {
                const errorMsg = typeof res.data === 'object' 
                    ? Object.values(res.data).flat()[0] 
                    : res.message;
                context.alertBox("error", errorMsg);
                setIsLoading(false);
            }
        });
    }

    return (
        <section className='py-5 sm:py-10 min-h-screen flex items-center justify-center bg-[#0d0d0d]'>
            <div className='container flex justify-center'>
                <div className='w-full sm:w-100 m-auto rounded-2xl bg-[#1a1a1a] border border-white/10 p-5 px-10 shadow-2xl'>
                
                    <h3 className='text-center text-[18px] font-semibold text-white'>
                        Register with a new account
                    </h3>

                    <form className="w-full mt-5" onSubmit={handleSubmit}>
                        <Stack spacing={3}>

                            <TextField
                                type="text"
                                id="name"
                                name="name"
                                value={formFields.name}
                                disabled={isLoading}
                                label="Full Name"
                                variant="outlined"
                                fullWidth
                                sx={darkFieldSx}
                                onChange={onChangeInput}
                            />

                            <TextField
                                type="text"
                                id="email"
                                name="email"
                                value={formFields.email}
                                disabled={isLoading}
                                label="Email"
                                variant="outlined"
                                fullWidth
                                sx={darkFieldSx}
                                onChange={onChangeInput}
                            />

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

                            <div className="relative">
                                <TextField
                                    type={isPasswordShow ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formFields.password}
                                    disabled={isLoading}
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    sx={darkFieldSx}
                                    onChange={onChangeInput}
                                />
                                
                                <Button
                                    type="button"
                                    className="absolute! top-[50%] right-2.5 -translate-y-1/2 
                                                w-8.75! h-8.75! min-w-8.75! 
                                                rounded-full! text-gray-400!"
                                    onClick={() => setIsPasswordShow(!isPasswordShow)}
                                    >
                                    {isPasswordShow ? (
                                        <IoMdEyeOff className="text-[20px] opacity-75" />
                                    ) : (
                                        <IoMdEye className="text-[20px] opacity-75" />
                                    )}
                                </Button>
                            </div>

                            <div className="relative">
                                <TextField
                                    type={isPasswordShow ? "text" : "password"}
                                    id="password2"
                                    name="password2"
                                    value={formFields.password2}
                                    disabled={isLoading}
                                    label="Confirm Password"
                                    variant="outlined"
                                    fullWidth
                                    sx={darkFieldSx}
                                    onChange={onChangeInput}
                                />
                                
                                <Button
                                    type="button"
                                    className="absolute! top-[50%] right-2.5 -translate-y-1/2 
                                                w-8.75! h-8.75! min-w-8.75! 
                                                rounded-full! text-gray-400!"
                                    onClick={() => setIsPasswordShow(!isPasswordShow)}
                                    >
                                    {isPasswordShow ? (
                                        <IoMdEyeOff className="text-[20px] opacity-75" />
                                    ) : (
                                        <IoMdEye className="text-[20px] opacity-75" />
                                    )}
                                </Button>
                            </div>

                            <Button
                                type="submit"
                                disabled={!valideValue || isLoading}
                                className="w-full! flex! gap-3! bg-red-500! hover:bg-red-600! disabled:bg-[#333]! text-white! py-3! rounded-2xl! normal-case!"
                            >
                                {isLoading ? <CircularProgress color="inherit" size={22} /> : "Send Otp"}
                            </Button>

                            <p className="text-center text-sm text-gray-400">
                                Already have an account?{" "}
                                <Link className="font-semibold text-red-500 hover:text-red-400" to="/login">
                                Log In
                                </Link>
                            </p>

                        </Stack>
                    </form>

                </div>
            </div>
        </section>
    )
}

export default Register;