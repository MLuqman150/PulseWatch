"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
    token: string | null
    isAuthenticated: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        () => {
            if (typeof window !== "undefined") {
              return localStorage.getItem("token")
            }
            return null
          }
    );

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    }

    const login = (token: string) =>{
        localStorage.setItem("token", token);
        setToken(token);
    }

    return (
        <AuthContext.Provider value={{token, login, isAuthenticated: token ? true : false, logout}}>
            {children}
        </AuthContext.Provider>    
    )
}

export const useAuth = () =>{
    const context  = useContext(AuthContext)

    if(!context){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}