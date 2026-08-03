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
    lastChecked: {
        checkedAt: string
        status: string
        responseTime: number | null
    },
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
                <div className="m-2 p-2 flex items-center justify-between bg-gray-100 rounded-4xl">
                    <h1 className="text-center text-xl font-semibold">Website Detail</h1>
                    <button onClick={handleLogout} className="m-2 bg-black p-2 text-white font-medium rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-800">Logout</button>
                </div>
                <div>
                    <button onClick={handleBack} className=" cursor-pointer hover:underline">Back to Dashboard</button>
                </div>
                <div className="py-2">
                    <h2>Stats</h2>
                    <p>Total Checks: {stats?.totalChecks}</p>
                    <p>Total Up time: {stats?.totalUp}</p>
                    <p>Up time: {stats?.uptime}</p>
                    <p>Average Response Time: {stats?.avgResponseTime}</p>
                    <p>Last Checked: {stats?.lastChecked ? new Date(stats.lastChecked.checkedAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div className="w-full max-w-5xl mt-8 overflow-x-auto rounded-xl border border-gray-200 shadow-md">
                    <h2 className="text-md font-bold p-2">History</h2>
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left">ID</th>
                                <th className="px-6 py-3 text-left">WebsiteID</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Response Time</th>
                                <th className="px-6 py-3 text-left">Last Checked</th>
                            </tr>
                        </thead>
        
                        <tbody>
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500">
                                        No websites added yet. Add your first website above.
                                    </td>
                                </tr>
                            )}
                            {history?.map((element,index) => (
                                <tr className="border-b transition-colors" key={element.id} >
                                    <td className="px-6 py-4">{ index + 1 }</td>
                                    <td className="px-6 py-4">{element?.websiteId}</td>
                                    <td className="px-6 py-4">{element?.status}</td>
                                    <td className="px-6 py-4">{element?.responseTime}</td>
                                    <td className="px-6 py-4">{element?.checkedAt ? new Date(element.checkedAt).toLocaleString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </ProtectedRoutes>
    )
}