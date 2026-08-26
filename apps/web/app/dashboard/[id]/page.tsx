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
                    <button onClick={handleBack} className=" cursor-pointer hover:underline hover:font-bold">Back to Dashboard</button>
                </div>
                <div className="flex items-center justify-center flex-col">
                    <div className="w-full max-w-5xl mt-6">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">
                                Stats
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                                {/* Total Checks */}
                                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                    <p className="text-sm text-gray-500">
                                        Total Checks
                                    </p>
                                    <p className="mt-1 text-2xl font-bold">
                                        {stats?.totalChecks ?? 0}
                                    </p>
                                </div>

                                {/* Total Up */}
                                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                    <p className="text-sm text-gray-500">
                                        Total Up
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-green-600">
                                        {stats?.totalUp ?? 0}
                                    </p>
                                </div>

                                {/* Uptime */}
                                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                    <p className="text-sm text-gray-500">
                                        Uptime
                                    </p>
                                    <p className="mt-1 text-2xl font-bold">
                                        {stats?.uptime ?? 0}%
                                    </p>
                                </div>

                                {/* Response Time */}
                                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                    <p className="text-sm text-gray-500">
                                        Avg. Response
                                    </p>
                                    <p className="mt-1 text-2xl font-bold">
                                        {stats?.avgResponseTime.toFixed(0) ?? 0}
                                        <span className="text-sm font-medium text-gray-500 ml-1">
                                            ms
                                        </span>
                                    </p>
                                </div>

                                {/* Last Checked */}
                                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                    <p className="text-sm text-gray-500">
                                        Last Checked
                                    </p>
                                    <p className="mt-1 text-sm font-semibold">
                                        {stats?.lastChecked
                                            ? new Date(
                                                stats.lastChecked.checkedAt
                                            ).toLocaleString()
                                            : "N/A"}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-5xl mt-8 overflow-x-auto rounded-xl border border-gray-200 shadow-md">
                        <h2 className="text-md font-bold p-2">History</h2>
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left">ID</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Response Time</th>
                                    <th className="px-6 py-3 text-left">Last Checked</th>
                                </tr>
                            </thead>
            
                            <tbody>
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-500">
                                            No checks recorded in the last 24 hours.
                                        </td>
                                    </tr>
                                )}
                                {history?.map((element,index) => (
                                    <tr className="border-b transition-colors" key={element.id} >
                                        <td className="px-6 py-4">{ index + 1 }</td>
                                        <td className="px-6 py-4">{element?.status === "UP" ? <span className="text-green-500">UP</span> : element?.status === "DOWN" ? <span className="text-red-500">DOWN</span> : <span className="text-yellow-500">DEGRADED</span>}</td>
                                        <td className="px-6 py-4">{element?.responseTime ? `${element?.responseTime} ms` : 'N/A'}</td>
                                        <td className="px-6 py-4">{element?.checkedAt ? new Date(element.checkedAt).toLocaleString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
        </ProtectedRoutes>
    )
}