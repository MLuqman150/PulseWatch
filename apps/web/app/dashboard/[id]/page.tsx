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

export default function WebsiteDetailPage() {

    const { logout } = useAuth();

    const { id } = useParams();
    
    const router = useRouter();
    
    const [stats, setStats] = useState<stats | null>(null);

    const [history, setHistory] = useState<websiteHistory[]>([]);

    const fetchStats = async () => {
        try {
            const resp = await axiosInstance.get(`/websites/${id}/stats`);
            setStats(resp?.data);
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

    const fetchData = async () => {
        try {
            await Promise.all([fetchStats(), fetchHistory()])
        }
        catch(e){
            const message = axios.isAxiosError(e)
                ? e.response?.data?.message ?? "Something went wrong"
                : "Something went wrong";
            showToast.error(message, {
                duration: 2000,
                position: "top-right",
                transition: "bounceIn",
                progress: true
            });
        };
        
    }

    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    },[])

    useEffect(()=>{
        const interval = setInterval(fetchData,  5 * 60 * 1000);
        return () => clearInterval(interval);
    },[])


    return (
        <ProtectedRoutes>
            <div>
                <h1>Website Detail</h1>
                <button onClick={handleLogout} className="cursor-pointer">Logout</button>
                <button onClick={handleBack} className="cursor-pointer hover:underline">Back to Dashboard</button>
                <div>
                    <h2>Stats</h2>
                    <p>Total Checks: {stats?.totalChecks}</p>
                    <p>Total Up time: {stats?.totalUp}</p>
                    <p>Up time: {stats?.uptime}</p>
                    <p>Average Response Time: {stats?.avgResponseTime}</p>
                    <p>Last Checked: {stats?.lastChecked ? new Date(stats.lastChecked).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                    <h2>History</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>WebsiteID</th>
                                <th>Status</th>
                                <th>Response Time</th>
                                <th>Last Checked</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history?.map((element,index) => (
                                <tr key={element.id}>
                                    <td>{ index + 1 }</td>
                                    <td>{element?.websiteId}</td>
                                    <td>{element?.status}</td>
                                    <td>{element?.responseTime}</td>
                                    <td>{element?.checkedAt ? new Date(element.checkedAt).toLocaleString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ProtectedRoutes>
    )
}