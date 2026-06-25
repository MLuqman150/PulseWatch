"use client";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";
import axios from "axios";
import { useAuth } from "@/lib/auth-context";

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
            <h1>Login</h1>
            <div>
            <form action="" method="POST" onSubmit={handleSubmit(onSubmit)}>
                {/* Email input */}
                <div>
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
                    />  
                    {errors?.email && (
                    <p className="text-red-600 text-sm">
                        {errors?.email?.message}
                    </p>
                    )}
                </div>
                
                {/* Password input */}
                <div>
                    <label htmlFor="password">Password: </label>
                    <input
                        {...register("password", { required: true } )} 
                        type="password"
                        name="password"
                        id="password"
                        placeholder="password"
                        autoComplete="off"    
                    />
                    {errors?.password && (
                        <p className="text-red-600 text-sm">
                        {errors?.password?.message}
                        </p>
                    )}  
                </div>

                {/* Submit button */}

                <button 
                    type="submit"
                    disabled={!isValid || isSubmitting}
                >
                    {isSubmitting ? "Loading..." : "Sign In"}
                </button>

            </form>
            <p>
                 Don&apos;t have an account? <Link href="/register">Sign Up</Link>  
            </p>
            </div>
        </>
    )
}