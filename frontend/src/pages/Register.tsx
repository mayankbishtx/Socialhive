import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/auth/register", { name, email, password });
            navigate("/login");
            toast.success("Profile created successfully")

        } catch (err) {
            console.log(err);
            setError("Error occurred while registering");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center gap-14">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    className="border border-white rounded p-2 w-67 dark:text-white"
                    type="text"
                    autoComplete="current-username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name"
                    required
                    disabled={loading}
                />
                <input
                    className="border border-white rounded p-2 w-67 dark:text-white"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    required
                    disabled={loading}
                />

                <input
                    className="border border-white rounded p-2 w-67 dark:text-white"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    required
                    disabled={loading}
                />

                <p className="text-sm text-taupe-400 hover:text-taupe-600 dark:hover:text-taupe-300">
                    Already have an account?&nbsp;
                    <Link to="/login" className="text-blue-500 hover:text-blue-700 underline">
                        Login
                    </Link>
                </p>

                {error && <p className="text-red-500 mt-2">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 p-2 w-35 self-center border rounded-md cursor-pointer 
                    bg-taupe-700 hover:bg-taupe-800 text-white">
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    )
};