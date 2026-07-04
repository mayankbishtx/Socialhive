import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await api.post("/auth/login", { email, password });
            login(data.user, data.accessToken);
            navigate("/");
            toast.success(`Welcome Back! ${data.user.name}`);

        } catch (err) {
            console.log(err);
            setError("Invalid Email or Password");

        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="h-screen flex items-center justify-center gap-14">
            <div className=" flex items-center flex-col rounded-xl p-10 py-25 bg-white dark:bg-black border border-[#bcbdb2] dark:border-[#4b4b47]">
                <h1 className="text-2xl font-bold text-black mb-8 dark:text-white">Welcome back!</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        className="border rounded p-2 w-67 text-black dark:text-white"
                        type="email"
                        autoComplete="current-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email"
                        required
                        disabled={loading}
                    />

                    <input
                        className="border rounded p-2 w-67 text-black dark:text-white"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        required
                        disabled={loading}
                    />

                    <p className="text-sm text-taupe-400 hover:text-gray-500 dark:hover:text-gray-200">Don't have an account?&nbsp;
                        <Link to="/register" className="text-blue-500 underline">
                            Create Account
                        </Link>
                    </p>

                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 p-2 w-35 self-center border rounded-md cursor-pointer bg-black
                    hover:bg-gray-900 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
};