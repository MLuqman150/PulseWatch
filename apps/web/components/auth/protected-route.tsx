"use client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoutes({ children }: {children: React.ReactNode}){
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(()=>{
        if(!isAuthenticated){
            router.push("/login")
        }
    },[isAuthenticated, router])

    if(!isAuthenticated){
        return (
            <div className="flex items-center justify-center min-h-screen">
              <p>Redirecting to login...</p>
            </div>
          )
    }

    return (
        <div>
            {children}
        </div>
    )

}