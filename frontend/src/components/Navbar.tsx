import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth";
import SearchBar from "./SearchBar";
import { useTheme } from "../context/useTheme";
import { Bell, House, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <div className="backdrop-blur-2xl hidden md:flex max-w-2xl mx-auto sticky top-8 border border-[#dcdec1] bg-white dark:bg-black dark:border-[#484843] p-3 items-center justify-between px-8 shadow rounded-lg">
                <div className="font-bold text-xl cursor-pointer dark:text-white" onClick={() => navigate("/")}>
                    Socialhive
                </div>

                <SearchBar />

                <div className="flex flex-row gap-6">
                    <button
                        onClick={() => navigate("/")}
                        className={`cursor-pointer px-2 py-2 border rounded-full dark:border-[#8e8e85] dark:bg-black ${location.pathname === '/' ? 'bg-gray-100 dark:bg-gray-500' : ''}`}>
                        <House size={18} className="dark:text-white" />
                    </button>

                    <button
                        onClick={() => navigate(`/profile/${user!.username}`)}
                        className={`cursor-pointer border px-2 py-2 rounded-full dark:border-[#8e8e85] dark:bg-black ${location.pathname === `/profile/${user!.username}` ? 'bg-gray-100 dark:bg-gray-500' : ''}`}>
                        <User size={18} className="dark:text-white" />
                    </button>


                    <button
                        onClick={() => navigate("/notifications")}
                        className={`cursor-pointer px-2 py-2 rounded-full border dark:border-[#8e8e85] dark:bg-black ${location.pathname === '/notifications' ? 'bg-gray-100 dark:bg-gray-500' : ''}`}>
                        <Bell size={18} className="dark:text-white " />
                    </button>

                    <button
                        onClick={() => {
                            const confirmed = window.confirm("Are you sure you want to logout?");
                            if (confirmed) {
                                logout();
                                navigate("/login");
                            }
                        }}
                        className="px-2 py-2 border rounded-full cursor-pointer dark:border-[#8e8e85] dark:bg-black">
                        <LogOut size={18} className="dark:text-white" />
                    </button>
                    <button onClick={toggleTheme} className="cursor-pointer p-2 rounded-full border dark:border-[#8e8e85] dark:bg-black">
                        {isDark ? <Sun size={18} className="dark:text-white" /> : <Moon size={18} className="dark:text-white" />}
                    </button>
                </div>
            </div>

            <nav className="md:hidden">
                <div className="flex items-center justify-between px-4 py-3 dark:text-white">
                    <span className="text-xl font-bold">Social</span>
                    <SearchBar />

                    <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                        <Menu size={22} />
                    </button>
                </div>

                {menuOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                )}

                {menuOpen && (
                    <>
                        <div className="md:hidden flex flex-col gap-3 px-4 pb-4 relative z-50 font-medium border-t border-[#dcdec1] dark:text-white dark:border-gray-700">
                            <button onClick={() => { navigate("/"); setMenuOpen(false); }}>
                                Home
                            </button>
                            <button onClick={() => { navigate(`/profile/${user!.username}`); setMenuOpen(false); }}>
                                Profile
                            </button>
                            <button onClick={() => { navigate("/notifications"); setMenuOpen(false); }}>
                                Notifications
                            </button>
                            <button onClick={() => {
                                const confirm = window.confirm("Are you sure u want to logout?")
                                if (confirm) {
                                    logout();
                                }
                                navigate("/login");
                            }}>
                                Logout
                            </button>
                            <button onClick={toggleTheme}>
                                {isDark ? "Light Mode" : "Dark Mode"}
                            </button>

                        </div>
                    </>
                )}

            </nav>
        </>
    )
}