"use client";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";
import axios from "axios";

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
        <div className="">
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
                {isSubmitting ? "Loading..." : "Sign Up"}
            </button>

          </form>
          <p>
            Already have an account? <Link href="/login">Sign In</Link>  
          </p>
        </div>
      </>
    )

}
