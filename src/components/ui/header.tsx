import {ThemeToggle} from "@/components/ui/theme-toggle";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 bg-[#159D7B] ">
            <h1 className="text-2xl font-bold text-white">Foci To-Do</h1>
            <ThemeToggle/>
        </header>
    );
}
