import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export type ErrorResponse = {
    message: string;
    retryAfter: number;
}

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });
            login(response.data.user, response.data.accessToken);
            navigate("/home");
            toast.success(`Welcome Back! ${response.data.user.name}`);

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
    }

    return (
        <div className="h-screen flex items-center justify-center gap-14 bg-linear-to-br from-slate-50 via-blue-50 to-sky-100 dark:from-neutral-900 dark:via-gray-400 dark:to-gray-400">
            <div className=" flex items-center flex-col p-12 py-25">
                <h1 className="text-3xl font-semibold text-black mb-8 dark:text-white">Welcome back!</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        className="border-2 border-neutral-300 p-2 rounded-md w-67 text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                        type="email"
                        autoComplete="current-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email address"
                        required
                        disabled={loading}
                    />
                    <input
                        className="border-2 border-neutral-300 rounded-md p-2 w-67 font-sans text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        required
                        disabled={loading}
                    />

                    <p className="text-sm text-taupe-500 hover:text-taupe-600 dark:hover:text-gray-200">Don't have an account?&nbsp;
                        <Link to="/register" className="text-blue-500 hover:text-blue-600 dark:text-white hover:underline ">
                            Create one →
                        </Link>
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 p-2 self-center border rounded-xl cursor-pointer bg-blue-500 w-full hover:bg-blue-600 
                    text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black transition-all duration-all ease-in-out hover:translate-y-0.5 hover:shadow-lg">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
};