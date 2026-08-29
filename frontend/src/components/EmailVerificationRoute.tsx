import { Navigate } from "react-router-dom";
import type { Props } from "../types";

export default function EmailVerificationRoute({ children }: Props) {

    const token = sessionStorage.getItem("verificationToken");

    if (!token) return <Navigate to="login" replace/>

    return children;
}