import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { ErrorResponse } from "./Login";

export default function Register() {

    const [name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/auth/register", { name, username, email, password });
            navigate("/login");

        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;

            if (error.response?.status === 429) {
                const retryAfter = error.response.data?.retryAfter;
                toast.error(
                    retryAfter ? `Too many attemps.Try again in ${Math.ceil(retryAfter / 60)} minute(s).`
                        : error.response?.data?.message
                );

            } else {
                toast.error(error.response?.data?.message ?? "Something went wrong. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center gap-14 bg-linear-to-br from-slate-50 via-blue-50 to-sky-100 dark:from-neutral-900 dark:via-gray-400 dark:to-gray-400">
            <div className="flex flex-col items-center px-9 py-18 lg:px-18 lg:py-30">
                <h1 className="text-3xl text-black font-semibold mb-8 dark:text-white">Create an account</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        className="border-2 border-neutral-300 dark:border-white rounded-md p-2 w-67 text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                        type="text"
                        autoComplete="current-username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="name"
                        required
                        disabled={loading}
                    />

                    <input
                        className="border-2 border-neutral-300 dark:border-white rounded-md p-2 w-67 text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                        type="text"
                        autoComplete="current-username"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="username"
                        required
                        disabled={loading}
                    />

                    <input
                        className="border-2 border-neutral-300 dark:border-white rounded-md p-2 w-67 text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email"
                        required
                        disabled={loading}
                    />

                    <input
                        className="border-2 border-neutral-300 dark:border-white font-sans rounded-sm p-2 w-67 text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        required
                        disabled={loading}
                    />

                    <p className="ml-5 text-sm text-taupe-500 hover:text-taupe-600 dark:hover:text-gray-300">
                        Already have an account?&nbsp;
                        <Link to="/login" className="text-blue-500 hover:text-blue-600 dark:text-white hover:underline">
                            Login
                        </Link>
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 p-2 self-center border rounded-xl cursor-pointer w-full
                    bg-blue-500 hover:bg-blue-600 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black transition-all duration-200 ease-in-out hover:translate-y-0.5 hover:shadow-lg">
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    )
};