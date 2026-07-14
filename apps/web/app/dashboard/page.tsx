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
                <h1 className="text-center">Dashboard</h1>
                <button onClick={handleLogout} className="cursor-pointer">Logout</button>
                <form action="" method="POST" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="url">Add Website</label>
                        <input
                            {...register("url", { required: "Website url is required" })}
                            type="text"
                            id="url"
                            name="url"
                            placeholder="Add a website"
                        />
                        {errors?.url && (
                            <p className="text-red-600 text-sm">
                                {errors?.url?.message}
                            </p>
                        )}
                        <button type="submit" disabled={!isValid || isSubmitting}>Add</button>
                    </div>
                </form>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Website</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {websites.map((website, index) => (
                                <tr key={website.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link href={`/dashboard/${website.id}`}>
                                            {website.url}
                                        </Link>
                                    </td>
                                    <td>{new Date(website.createdAt).toLocaleDateString()}</td>
                                    <td><button className="text-red-400 cursor-pointer hover:underline" onClick={()=> {handleDelete(website.id)}}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ProtectedRoutes>
        </>
    )
}