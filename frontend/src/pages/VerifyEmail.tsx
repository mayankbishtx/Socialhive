import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import api from "../api/axios";

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
        } finally {
            setLoading(true);
        }
    }

    return (
        <>
            <div className="h-screen flex items-center justify-center">
                <h1 className="text-5xl">Page Design Under construction Working in fine</h1>
                <div className="border rounded-xl px-10 py-40 bg-gray-100">
                    <form onSubmit={handleVerify}>
                        <h1>OTP has been sent to {email}</h1>
                        <h1 className="text-3xl font-semibold">Enter verification code</h1>

                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            required
                            className="border rounded p-2"
                        />

                        <button type="submit" disabled={loading} className="bg-black text-white rounded p-2">
                            {loading ? "Verifying" : "Verify"}
                        </button>
                    </form>

                </div>
            </div>
        </>
    )

}