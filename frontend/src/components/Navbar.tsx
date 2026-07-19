import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth";
import SearchBar from "./SearchBar";
import { useTheme } from "../context/useTheme";
import { Menu, Moon, Sun } from "lucide-react";
import { useRef, useState } from "react";

export default function Navbar() {

    const navigate = useNavigate();
    const { user, logout, authLoading } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const audioRef = useRef(new Audio("/sounds/electic_button.mp3"));

    function playSound() {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }

    const handleThemeToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!document.startViewTransition) {
            toggleTheme();
            playSound();
            return;
        }

        const x = e.clientX;
        const y = e.clientY;

        document.documentElement.style.setProperty("--x", `${x}px`);
        document.documentElement.style.setProperty("--y", `${y}px`);

        const transition = document.startViewTransition(() => {
            toggleTheme();
            playSound();
        });

        await transition.ready;

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(150vmax at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 600,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            }
        );
    };

    if (authLoading || !user) return null;

    return (
        <>
            <div className="backdrop-blur-xl hidden md:flex w-[95%] max-w-4xl mx-auto sticky top-6 z-50 border border-gray-200 bg-white/90 dark:bg-black/90 dark:border-[#303336] py-3 items-center px-6 shadow rounded-2xl">
                <Link to="/home" className="font-bold text-xl cursor-pointer dark:text-white shrink-0 mr-8" >
                    🐝 Socialhive
                </Link>

                <div className="w-56 shrink-0">
                    <SearchBar />
                </div>


                <div className="flex items-center gap-2 ml-auto">
                    <Link
                        to="/home"
                        className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors dark:text-white hover:bg-gray-100 dark:hover:bg-[#1d1f20] ${location.pathname === '/home' ? 'bg-gray-100 dark:bg-[#1d1f20]' : ""}`}>
                        Home
                    </Link>

                    <Link
                        to={`/profile/${user.username}`}
                        className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors dark:text-white hover:bg-gray-100 dark:hover:bg-[#1d1f20] ${location.pathname === `/profile/${user.username}` ? 'bg-gray-100 dark:bg-[#1d1f20]    ' : ""}`}>
                        profile
                    </Link>


                    <Link
                        to="/notifications"
                        className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors dark:text-white hover:bg-gray-100 dark:hover:bg-[#1d1f20] ${location.pathname === '/notifications' ? 'bg-gray-100 dark:bg-[#1d1f20]   ' : ""}`}>
                        Notifications
                    </Link>

                    <button
                        onClick={async () => {
                            const confirmed = window.confirm("Are you sure you want to logout?");
                            if (confirmed) {
                                await logout();
                                navigate("/login");
                            }
                        }}
                        className="px-4 py-2 text-sm font-medium rounded-lg cursor-pointer dark:text-white hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors">
                        Logout
                    </button>

                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

                    <button onClick={handleThemeToggle} className="cursor-pointer p-2.5 rounded-full dark:text-white hover:bg-gray-100 dark:hover:bg-[#1d1f20] transition-colors">
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>

            <nav className="md:hidden sticky top-0 z-50 bg-white dark:bg-black">
                <div className="flex items-center justify-between px-4 py-3 dark:text-white">
                    <span className="text-xl font-bold" onClick={() => navigate("/")}>🐝 Socialhive</span>
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
                            <button onClick={() => { navigate("/home"); setMenuOpen(false); }}>
                                Home
                            </button>
                            <button onClick={() => { navigate(`/profile/${user.username}`); setMenuOpen(false); }}>
                                Profile
                            </button>
                            <button onClick={() => { navigate("/notifications"); setMenuOpen(false); }}>
                                Notifications
                            </button>
                            <button onClick={async () => {
                                const confirmed = window.confirm("Are you sure u want to logout?")
                                if (confirmed) {
                                    await logout();
                                    navigate("/login");
                                }
                            }}>
                                Logout
                            </button>
                            <button onClick={handleThemeToggle}>
                                {isDark ? "Light Mode" : "Dark Mode"}
                            </button>

                        </div>
                    </>
                )}

            </nav>
        </>
    )
}