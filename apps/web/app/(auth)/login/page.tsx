"use client";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";
import axios from "axios";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

interface LoginFormData {
    email: string
    password: string
}

export default function LoginPage(){
 
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting, isValid },
      } = useForm<LoginFormData>();

    const router = useRouter();
  
    const { login }= useAuth() 

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    }; 

    const onSubmit = async (data: LoginFormData)=> {
        try{
            const resp = await axiosInstance.post("/auth/login", data);
            login(resp.data.access_token)
            showToast.success(resp.data.message,{
                duration: 2000, 
                position: "top-right",
                transition: "bounceIn",
                progress: true
              });
              router.push("/dashboard")  
        } catch (e){
            const message = axios.isAxiosError(e) 
            ? e.response?.data?.message ?? "Something went wrong"
            : "Something went wrong";
            showToast.error(message,{
                duration: 2000, 
                position: "top-right",
                transition: "bounceIn",
                progress: true
            });
        }
      }

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="border-2 rounded-lg p-6 border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                    <h1 className="text-center text-xl font-semibold">Login</h1>
                    <form action="" method="POST" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email input */}
                        <div className="my-2">
                            <label htmlFor="email">Email address: </label>
                            <input
                                {...register("email",
                                    {   
                                        required: "Email is required",
                                        pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email format"
                                        } 
                                    }
                                )}
                                type="email"
                                name="email"
                                id="email" 
                                placeholder="Enter you valid email"
                                className="w-full max-w-md h-10 border rounded-lg px-4"
                            />  
                            {errors?.email && (
                            <p className="text-red-600 text-sm text-center font-normal">
                                {errors?.email?.message}
                            </p>
                            )}
                        </div>
                        
                        {/* Password input */}
                        <div className="my-2">
                            <label htmlFor="password">Password: </label>
                            <div className="relative">
                                <input
                                    {...register("password", { required: true } )} 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="password"
                                    autoComplete="off"    
                                    className="w-full max-w-md h-10 border rounded-lg px-4"
                                />
                                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-3 cursor-pointer">
                                    {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                </button>
                            </div>
                            {errors?.password && (
                                <p className="text-red-600 text-sm text-center font-normal">
                                {errors?.password?.message}
                                </p>
                            )}  
                        </div>

                        {/* Submit button */}

                        <button 
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="w-full my-2 bg-black p-2 text-white font-medium rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-800"
                        >
                            {isSubmitting ? "Loading..." : "Sign In"}
                        </button>

                    </form>
                    <p className="text-center">
                        Don&apos;t have an account? <Link className="underline hover:text-red-500" href="/register">Sign Up</Link>  
                    </p>
                </div>
            </div>
        </>
    )
}