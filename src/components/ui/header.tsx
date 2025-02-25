import {ThemeToggle} from "@/components/ui/theme-toggle";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 bg-[#159D7B] ">
            <h1 className="text-2xl font-bold text-white">Foci To-Do</h1>
            <div className="flex items-center gap-4">
                <ThemeToggle/>
                <Link href="/login">
                    <Button variant={'ghost'}>Logout</Button>
                </Link>
            </div>
        </header>
    );
}
