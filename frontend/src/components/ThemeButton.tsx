import { Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { useRef } from "react";

export default function ThemeButton() {

    const { pathname } = useLocation();
    const { isDark, toggleTheme } = useTheme();
    const audioRef = useRef(new Audio("/sounds/electic_button.mp3"));

    const showButton = ["/", "/login", "/register", "/verify-email"].includes(pathname);

    if (!showButton) return null;

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



    return (
        <button onClick={handleThemeToggle} className="fixed z-50 top-9 md:top-6 right-10 md:right-6 border
         border-[#dcdec1] dark:border-[#4f4f4b] rounded-lg px-3 py-3 dark:hover:bg-neutral-700
         hover:bg-neutral-100 flex text-neutral-500 hover:text-neutral-700
         dark:text-gray-200 dark:hover:text-white cursor-pointer">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    )
};