"use client";

import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {MonitorCog, Moon, SunMoon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <><DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'outline'}
                        className="bg-black/95 hover:bg-gray-800/90 rounded-md inline-flex text-white"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? (<Moon className="scale-150"/>) :
                        theme === "light" ? (<SunMoon className="scale-150"/>) :
                            <MonitorCog className="scale-150"/>}

                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={'end'}>
                <DropdownMenuCheckboxItem
                    checked={theme === "light"}
                    onCheckedChange={() => setTheme('light')}
                >
                    <SunMoon className={"mr-2"}/> Light
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={theme === "dark"}
                    onCheckedChange={() => setTheme('dark')}
                >
                    <Moon className={"mr-2"}/> Dark
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={!theme || theme === "system"}
                    onCheckedChange={() => setTheme('system')}
                >
                    <MonitorCog className={"mr-2"}/> System
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu></>
    );
}
