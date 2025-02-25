import {ThemeToggle} from "@/components/ui/theme-toggle";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import SearchTodo from "@/components/todo/components/search-todo";
import SortTodo from "@/components/todo/components/sort-todo";

export default function Header() {
    return (
        <header className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-[#159D7B] gap-2 ">
            <h1 className="order-1 text-2xl inline-block whitespace-nowrap font-bold text-white">Foci To-Do</h1>
            <div className="order-3 md:order-2 w-full md:max-w-2xl inline-flex gap-2 justify-center items-center">
                <SearchTodo/>
                <SortTodo/>
            </div>
            <div className="order-2 md:order-3 flex items-center gap-4">
                <ThemeToggle/>
                <Link href="/login">
                    <Button variant={'ghost'}>Logout</Button>
                </Link>
            </div>
        </header>
    );
}
