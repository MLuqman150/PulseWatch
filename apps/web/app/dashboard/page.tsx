"use client";
import ProtectedRoutes from "@/components/auth/protected-route";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { showToast } from "nextjs-toast-notify";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from 'next/link'

interface websiteUrl {
    url: string;
}

interface website {
    id: string,
    userId: string,
    url: string,
    createdAt: Date,
}

export default function DashboardPage() {

    const { logout } = useAuth();

    const router = useRouter();

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<websiteUrl>();

    const [websites, setWebsites] = useState<website[]>([]);

    const fetchWebsites = async () => {
        try {
            const resp = await axiosInstance.get("/websites");
            setWebsites(resp?.data.websites);
        } catch (e) {
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


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchWebsites();
    }, [])

    const onSubmit = async (data: websiteUrl) => {
        try {
            const resp = await axiosInstance.post("/websites", data)
            showToast.success(resp.data.message, {
                duration: 2000,
                position: "top-right",
                transition: "bounceIn",
                progress: true
            });

        } catch (e) {
            const message = axios.isAxiosError(e)
                ? e.response?.data?.message ?? "Something went wrong"
                : "Something went wrong";
            showToast.error(message, {
                duration: 2000,
                position: "top-right",
                transition: "bounceIn",
                progress: true
            });
        } finally {
            reset();
            fetchWebsites();
        }

    }

    const handleLogout = () =>{
        logout()
        router.push("/login")
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this website?")) {
            return
        }
        try {
            const resp = await axiosInstance.delete(`/websites/${id}`)
            showToast.success(resp.data.message, {
                duration: 2000,
                position: "top-right",
                transition: "bounceIn",
                progress: true
            });

        } catch (e) {
            const message = axios.isAxiosError(e)
                ? e.response?.data?.message ?? "Something went wrong"
                : "Something went wrong";
            showToast.error(message, {
                duration: 2000,
                position: "top-right",
                transition: "bounceIn",
                progress: true
            });
        } finally {
            fetchWebsites();
        }
    }

    return (
        <>
            <ProtectedRoutes>
                <div className="m-2 p-2 flex items-center justify-between bg-gray-100 rounded-4xl">
                    <h1 className="text-center text-xl font-semibold">Dashboard</h1>
                    <button onClick={handleLogout} className="m-2 bg-black p-2 text-white font-medium rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-800">Logout</button>
                </div>
                <div className="my-2 min-h-screen flex flex-col items-center">
                    <form action="" method="POST" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="url" className="text-lg">Add Website</label>
                            <input
                                {...register("url", { required: "Website url is required" })}
                                type="text"
                                id="url"
                                name="url"
                                placeholder="Add a website"
                                className="w-full max-w-md h-10 border rounded-lg px-4"
                            />
                            {errors?.url && (
                                <p className="text-red-600 text-sm">
                                    {errors?.url?.message}
                                </p>
                            )}
                            <div className="flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={!isValid || isSubmitting}
                                    className="my-2 bg-black p-2 text-white font-medium rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-800"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="w-full max-w-5xl mt-8 overflow-x-auto rounded-xl border border-gray-200 shadow-md"> 
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left">ID</th>
                                    <th className="px-6 py-3 text-left">Website</th>
                                    <th className="px-6 py-3 text-left">Created At</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                              {websites.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-500">
                                            No websites added yet. Add your first website above.
                                        </td>
                                    </tr>
                                )}
                                {websites.map((website, index) => (
                                    <tr className="border-b transition-colors" key={website.id}>
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <Link href={`/dashboard/${website.id}`} className="hover:underline hover:text-red-500">
                                                {website.url}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">{new Date(website.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-center"><button className="my-2 bg-red-600 p-2 text-white font-medium rounded-md cursor-pointer transition-colors duration-200 hover:bg-red-400" onClick={()=> {handleDelete(website.id)}}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ProtectedRoutes>
        </>
    )
}