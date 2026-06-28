import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import { setAccessToken as syncTokenToAxios } from "../api/axios";
import toast from "react-hot-toast";

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            localStorage.removeItem("user");
            return null;
        }

    });
    const [accessToken, setAccessToken] = useState<string | null>(() =>
        localStorage.getItem("accessToken")
    );

    const login = (userData: User, token: string) => {
        setUser(userData);
        setAccessToken(token);
        syncTokenToAxios(token);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(userData));

    }

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        syncTokenToAxios(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        toast.success("Logout successfull")
    };

    const updateUser = (userData: User) => {
    setUser({...userData});
};

    useEffect(() => {
        if (accessToken) {
            syncTokenToAxios(accessToken);
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// How the data gets managed ( the component, state, logic )