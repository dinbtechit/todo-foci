"use client";

import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Moon, SunMoon} from "lucide-react";

export function ThemeToggle() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            className="p-2 bg-gray-800 text-gray-300 rounded-md inline-flex"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? (<Moon className="mr-1"/>) :
                (<SunMoon className="mr-1"/>)}
        </button>
    );
}
