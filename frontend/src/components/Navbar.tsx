import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth";
import SearchBar from "./SearchBar";
import { useTheme } from "../context/useTheme";
import { Bell, House, LogOut, Moon, Sun, User } from "lucide-react";

export default function Navbar() {

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (

        <div className="backdrop-blur-2xl max-w-2xl mx-auto sticky top-8 bg-gray-100 dark:bg-white/50 flex p-3 items-center justify-between px-8 shadow-md rounded-full">
            <div className="font-bold text-xl cursor-pointer" onClick={() => navigate("/")}>
                Social
            </div>

            <SearchBar />

            <div className="flex flex-row gap-6">
                <button
                    onClick={() => navigate("/")}
                    className={`cursor-pointer px-2 py-2 border rounded-full shadow-lg ${location.pathname === '/' ? 'bg-gray-400' : ''}`}>
                    <House size={18}/>
                </button>

                <button
                    onClick={() => navigate(`/profile/${user!.id}`)}
                    className={`cursor-pointer shadow-lg border px-2 py-2 rounded-full ${location.pathname === `/profile/${user!.id}` ? 'bg-gray-400' : ''}`}>
                    <User size={18}/>
                </button>


                <button
                    onClick={() => navigate("/notifications")}
                    className={`cursor-pointer px-2 py-2 rounded-full shadow-lg border ${location.pathname === '/notifications' ? 'bg-gray-400' : ''}`}>
                    <Bell size={18}/>
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
                    <LogOut size={18}/>
                </button>
                <button onClick={toggleTheme} className="cursor-pointer p-2 rounded-full border">
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </div>
    )
}