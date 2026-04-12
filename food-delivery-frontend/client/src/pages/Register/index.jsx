import React, { useContext, useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import Stack from "@mui/material/Stack";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";


const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [formFields, setFormFields] = useState({
        name: "",
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


        postData("accounts/register/customer", formFields).then((res) => {
            // Note: Django returns res.data for your custom response structure
            if (res?.error !== true) {
                setIsLoading(false);
                context.alertBox("success", res?.message);
                
                // CRITICAL: Save the user ID and Phone for the Verify page
                localStorage.setItem("userId", res.data.id); 
                localStorage.setItem("username", formFields.phone);
                console.log(res);

                setFormFields({
                    name: "",
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
        <section className='section py-5 sm:py-10 min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='container flex justify-center'>
                <div className='card shadow-md w-full sm:w-100 m-auto rounded-md bg-white p-5 px-10'>
                
                    <h3 className='text-center text-[18px] font-semibold text-black'>
                        Register with a new account
                    </h3>

                    <form className="w-full mt-5" onSubmit={handleSubmit}>
                        <Stack spacing={3}>

                            {/* Full Name */}
                            <TextField
                                type="text"
                                id="name"
                                name="name"
                                value={formFields.name}
                                disabled={isLoading}
                                label="Full Name"
                                variant="outlined"
                                fullWidth
                                onChange={onChangeInput}
                            />

                            {/* Phone Number */}
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

                            {/* Password Field */}
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
                                    onChange={onChangeInput}
                                />
                                
                                <Button
                                    type="button"
                                    className="absolute! top-[50%] right-2.5 -translate-y-1/2 
                                                w-8.75! h-8.75! min-w-8.75! 
                                                rounded-full! text-black!"
                                    onClick={() => setIsPasswordShow(!isPasswordShow)}
                                    >
                                    {isPasswordShow ? (
                                        <IoMdEyeOff className="text-[20px] opacity-75" />
                                    ) : (
                                        <IoMdEye className="text-[20px] opacity-75" />
                                    )}
                                </Button>
                            </div>

                            {/* Confirm Password Field */}
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
                                    onChange={onChangeInput}
                                />
                                
                                <Button
                                    type="button"
                                    className="absolute! top-[50%] right-2.5 -translate-y-1/2 
                                                w-8.75! h-8.75! min-w-8.75! 
                                                rounded-full! text-black!"
                                    onClick={() => setIsPasswordShow(!isPasswordShow)}
                                    >
                                    {isPasswordShow ? (
                                        <IoMdEyeOff className="text-[20px] opacity-75" />
                                    ) : (
                                        <IoMdEye className="text-[20px] opacity-75" />
                                    )}
                                </Button>
                            </div>

                            {/* Register Button */}
                            <Button
                                type="submit"
                                disabled={!valideValue || isLoading}
                                className="btn-org btn-lg w-full flex gap-3"
                            >
                                {isLoading ? <CircularProgress color="inherit" size={22} /> : "Send Otp"}
                            </Button>

                            {/* Login Link */}
                            <p className="text-center text-sm">
                                Already have an account?{" "}
                                <Link className="link font-semibold text-primary" to="/login">
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