"use client";

import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Moon, SunMoon} from "lucide-react";
import {Button} from "@/components/ui/button";

export function ThemeToggle() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button variant={'secondary'}
                className="rounded-md inline-flex"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? (<Moon className="scale-150"/>) : (<SunMoon className="scale-150"/>)}
        </Button>
    );
}
