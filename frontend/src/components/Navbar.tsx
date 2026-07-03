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

        <div className="backdrop-blur-2xl max-w-2xl mx-auto sticky top-8 border border-[#dcdec1] bg-white dark:bg-black dark:border-[#484843] flex p-3 items-center justify-between px-8 shadow rounded-lg">
            <div className="font-bold text-xl cursor-pointer dark:text-white" onClick={() => navigate("/")}>
                Social
            </div>

            <SearchBar />

            <div className="flex flex-row gap-6">
                <button
                    onClick={() => navigate("/")}
                    className={`cursor-pointer px-2 py-2 border rounded-full shadow-lg dark:border-[#8e8e85] dark:bg-black ${location.pathname === '/' ? 'bg-gray-200 dark:bg-gray-500' : ''}`}>
                    <House size={18} className="dark:text-white"/>
                </button>

                <button
                    onClick={() => navigate(`/profile/${user!.id}`)}
                    className={`cursor-pointer shadow-lg border px-2 py-2 rounded-full dark:border-[#8e8e85] dark:bg-black ${location.pathname === `/profile/${user!.id}` ? 'bg-gray-200 dark:bg-gray-500' : ''}`}>
                    <User size={18} className="dark:text-white"/>
                </button>


                <button
                    onClick={() => navigate("/notifications")}
                    className={`cursor-pointer px-2 py-2 rounded-full shadow-lg border dark:border-[#8e8e85] dark:bg-black ${location.pathname === '/notifications' ? 'bg-gray-200 dark:bg-gray-500' : ''}`}>
                    <Bell size={18} className="dark:text-white "/>
                </button>

                <button
                    onClick={() => {
                        const confirmed = window.confirm("Are you sure you want to logout?");
                        if (confirmed) {
                            logout();
                            navigate("/login");
                        }
                    }}
                    className="px-2 py-2 border rounded-full shadow-lg cursor-pointer dark:border-[#8e8e85] dark:bg-black">
                    <LogOut size={18} className="dark:text-white"/>
                </button>
                <button onClick={toggleTheme} className="cursor-pointer p-2 rounded-full border dark:border-[#8e8e85] dark:bg-black">
                    {isDark ? <Sun size={18} className="dark:text-white"/> : <Moon size={18} className="dark:text-white"/>}
                </button>
            </div>
        </div>
    )
}