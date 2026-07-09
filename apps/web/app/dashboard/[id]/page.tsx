"use client";
import ProtectedRoutes from "@/components/auth/protected-route";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { showToast } from "nextjs-toast-notify";
import axios from "axios";
import { useParams, useRouter } from 'next/navigation'

interface stats {
    totalChecks: number,
    totalUp: number,
    uptime: number,
    avgResponseTime: number,
    lastChecked: Date,
}

interface websiteHistory {
    id: string;
    websiteId: string;
    status: "UP" | "DOWN" | "DEGRADED";
    responseTime: number | null;
    checkedAt: Date;
}

interface history {
    history: websiteHistory[];
}

export default function WebsiteDetailPage() {

    const { logout } = useAuth();

    const { id } = useParams();
    
    const router = useRouter();
    
    const [stats, setStats] = useState<stats | null>(null);

    const [history, setHistory] = useState<history | null>(null);

    const fetchStats = async () => {
        try {
            const resp = await axiosInstance.get(`/websites/${id}/stats`);
            setStats(resp?.data.stats);
        }
        catch (e) {
            const message = axios.isAxiosError(e)
                ? e.response?.data?.message ?? "Something went wrong"
                : "Something went wrong";
            showToast.error(message, {
                duration: 2000,
                position: "top-right",
                transition: "bounceIn",
                progress: true
            });
        }
    }

    const fetchHistory = async () => {
        try {
            const resp = await axiosInstance.get(`/websites/${id}/history`);
            setHistory(resp?.data.history);
        }
        catch (e) {
            const message = axios.isAxiosError(e)
                ? e.response?.data?.message ?? "Something went wrong"
                : "Something went wrong";
            showToast.error(message, {
                duration: 2000,
                position: "top-right",
                transition: "bounceIn",
                progress: true
            });
        }
    }

    const handleLogout = () =>{
        logout()
        router.push("/login")
    }

    const handleBack = () => {
        router.push("/dashboard")
    }

    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        Promise.all([fetchStats(), fetchHistory()])
        .then(()=>{
            console.log(stats, history);
        })
        .catch((e)=>{
            const message = axios.isAxiosError(e)
                ? e.response?.data?.message ?? "Something went wrong"
                : "Something went wrong";
            showToast.error(message, {
                duration: 2000,
                position: "top-right",
                transition: "bounceIn",
                progress: true
            });
        });
    },[id])


    return (
        <ProtectedRoutes>
            <div>
                <h1>Website Detail</h1>
            </div>
        </ProtectedRoutes>
    )
}