import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import api from "../api/axios";
import toast from "react-hot-toast";

export default function VerifyEmail() {

    const location = useLocation();
    const email = location.state?.email;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        setLoading(false);

        try {
            await api.post("/auth/verify-email", { email, otp: Number(otp) });
            navigate("/login");

            

        } catch (err) {
            console.log("Verification Error", err);
            toast.error("Wrong OTP");

        } finally {
            setLoading(true);
        }
    }

    return (
        <>
            <div className="h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to dark:bg-linear-to-br dark:from-neutral-900 dark:text-white">
                <div className="px-10 py-40">
                        <h1 className="text-3xl font-semibold">Enter verification code</h1>
                    <form onSubmit={handleVerify} className="p-2 flex flex-col items-center justify-center gap-3 ">
                        <h1>OTP has been sent to <span className="font-bold">{email}</span></h1>

                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            required
                            className="border-2 border-neutral-300 dark:border-white rounded-md p-2 w-67 text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white"
                        />

                        <button type="submit" disabled={loading} className="mt-4 p-2 self-center border rounded-xl cursor-pointer w-67
                    bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black transition-all duration-200 ease-in-out hover:translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Verifying" : "Verify"}
                        </button>

                    </form>

                </div>
            </div>
        </>
    )

}