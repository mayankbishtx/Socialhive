import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import api, { setAccessToken as syncTokenToAxios, setAccessTokenChangeHandler } from "../api/axios";
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

    const [accessToken, setAccessToken] = useState<string | null>(null);

    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        setAccessTokenChangeHandler((newToken) => {
            setAccessToken(newToken);
        });

        const restoreSession = async () => {
            try {
                const { data } = await api.post("/auth/refresh-token", {});

                setAccessToken(data.accessToken);
                syncTokenToAxios(data.accessToken);

                localStorage.setItem(
                    "accessToken",
                    data.accessToken
                );
            } catch {
                setAccessToken(null);
                syncTokenToAxios(null);

                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");

                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        setAccessToken(token);
        syncTokenToAxios(token);

        localStorage.setItem("accessToken", token);
        localStorage.setItem( "user",JSON.stringify(userData)
        );
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.log("Logout Error", error);
        } finally {
            setUser(null);
            setAccessToken(null);
            syncTokenToAxios(null);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            toast.success("Logout successful");
        }
    };

    const updateUser = (userData: User) => {
        setUser({ ...userData });
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, authLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};