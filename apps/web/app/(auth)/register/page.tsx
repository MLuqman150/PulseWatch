"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axiosInstance from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";
import axios from "axios";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

interface RegisterFormData {
    email: string
    password: string
}

export default function RegisterPage() {
    const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting, isValid },
    } = useForm<RegisterFormData>();

    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
   };

    const onSubmit = async (data: RegisterFormData)=>{
      
      try{
          const resp = await axiosInstance.post("/auth/register", data);
          showToast.success(resp.data.message,{
            duration: 2000, 
            position: "top-right",
            transition: "bounceIn",
            progress: true
          })   
          router.push("/login");     
      } catch(e){
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
            <h1 className="text-center text-xl font-semibold">Register</h1>
            <form action="" method="POST" onSubmit={handleSubmit(onSubmit)} >
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
                        {...register("password",
                            { 
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                },
                                maxLength: {
                                    value: 32,
                                    message: "Password cannot exceed 32 characters"
                                },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/,
                                    message: "The password should have an uppercase, lowercase letter, number and a special character"    
                                }
                            }
                        )} 
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
                  {isSubmitting ? "Loading..." : "Sign Up"}
              </button>

            </form>
            <p className="text-center">
              Already have an account? <Link className="underline hover:text-red-500" href="/login">Sign In</Link>  
            </p>
          </div>
        </div>

      </>
    )

}
