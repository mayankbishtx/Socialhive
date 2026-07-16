import { Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { useRef } from "react";

export default function ThemeButton() {

    const { pathname } = useLocation();
    const { isDark, toggleTheme } = useTheme();
    const audioRef = useRef(new Audio("/sounds/electic_button.mp3"));

    const showButton = ["/", "/login", "/register"].includes(pathname);

    if (!showButton) return null;

    function playSound() {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }

    function handleClick() {
        playSound();
        toggleTheme();
    }

    return (
        <button onClick={handleClick} className="fixed z-50 top-9 md:top-6 right-10 md:right-6 border
         border-[#dcdec1] dark:border-[#4f4f4b] rounded-lg px-3 py-3 dark:hover:bg-neutral-700
          hover:bg-neutral-100 flex text-neutral-500 hover:text-neutral-700
           dark:text-gray-200 dark:hover:text-white cursor-pointer">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    )
};