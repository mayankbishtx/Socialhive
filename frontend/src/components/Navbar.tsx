import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth";
import SearchBar from "./SearchBar";
import { useTheme } from "../context/useTheme";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (

        <div className="backdrop-blur-2xl max-w-2xl mx-auto sticky top-8 bg-white/70 flex p-3 items-center justify-between px-8 shadow-lg rounded-full">
            <div className="font-bold text-xl cursor-pointer" onClick={() => navigate("/")}>
                Social
            </div>

            <SearchBar />

            <div className="flex flex-row gap-6">
                <button
                    onClick={() => navigate("/")}
                    className={`cursor-pointer px-2 py-2 border rounded-full shadow-lg ${location.pathname === '/' ? 'bg-gray-400' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </button>

                <button
                    onClick={() => navigate(`/profile/${user!.id}`)}
                    className={`cursor-pointer shadow-lg border px-2 py-2 rounded-full ${location.pathname === `/profile/${user!.id}` ? 'bg-gray-400' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </button>


                <button
                    onClick={() => navigate("/notifications")}
                    className={`cursor-pointer px-2 py-2 rounded-full shadow-lg border ${location.pathname === '/notifications' ? 'bg-gray-400' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M10.5 8.25h3l-3 4.5h3" />
                    </svg>
                </button>



                <button
                    onClick={() => {
                        const confirmed = window.confirm("Are you sure you want to logout?");
                        if (confirmed) {
                            logout();
                            navigate("/login");
                        }
                    }}
                    className="px-2 py-2 border rounded-full shadow-lg cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                </button>
                <button onClick={toggleTheme} className="cursor-pointer p-2 rounded-full border">
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </div>
    )
}