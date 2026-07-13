import { useNavigate } from "react-router-dom"
import { Github } from '@thesvg/react';
import { useTheme } from "../context/useTheme";
import { Moon, Sun } from "lucide-react";

export default function LandingPage() {

    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    
    return (
        <>
        <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-sky-100 dark:from-black dark:via-black dark:to-black dark:text-white">
            <div onClick={toggleTheme} className="absolute top-10 right-62 rounded-full px-4 py-4 flex items-center dark:text-white cursor-pointer transition-all duration-200 hover:translate-y-0.5">
                {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </div>
            <a
                href="https://github.com/mayankbishtx/socialhive" 
                target="_blank"
                rel="noopener noreferrer"
                className="absolute flex items-center gap-2 rounded-full border px-4 py-2 bg-white/70 shadow-sm backdrop-blur top-10 right-16 text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <Github 
                    variant="light" 
                    className="size-8 hover:scale-110" 
                />
                 <span className="mt-1 hover:text-black">View Source ↗</span>
            </a>
            <div className="min-h-screen flex flex-col items-center justify-center gap-7 tracking-wide">
                <div className="mr-13 text-6xl font-bold">
                    <span className="text-5xl">🐝</span> Socialhive
                </div>
                <div className="flex gap-4 text-4xl font-semibold">
                    <span>Connect · </span>
                    <span>Share ·</span>
                    <span>Discover</span>
                </div>
                <div className="text-2xl font-medium">
                    Join the community, share your thoughts,
                    <br />
                    and connect with people around the world.
                </div>
                <div className="flex flex-row items-center gap-8">
                    <button onClick={() => navigate("/register")} className="bg-blue-600 text-white text-xl py-2 px-3 rounded-lg cursor-pointer shadow-sm transition-all duration-200 ease-in-out hover:translate-y-0.5 hover:bg-blue-700 hover:shadow-lg ">Get Started</button>
                    <button onClick={() => navigate("/login")} className="bg-transparent text-black dark:text-white border-2 border-blue-700 text-xl py-2 px-7 rounded-lg cursor-pointer shadow-sm transition-all duration-200 ease-in-out hover:translate-y-0.5 hover:shadow-lg">Login</button>
                </div>
            </div>
        </div>
        </>
    )
}