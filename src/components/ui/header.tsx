'use client';
import {ThemeToggle} from "@/components/ui/theme-toggle";
import {Button} from "@/components/ui/button";
import SortTodo from "@/components/todo/components/sort-todo";
import SearchTodo from "@/components/todo/components/search-todo";
import {useRouter} from "next/navigation";
import {isLoggedInState} from "@/components/user/state/user-state";
import {useAtom} from "jotai";

export default function Header() {
    const [isLoggedIn, setLoggedin] = useAtom(isLoggedInState)
    const router = useRouter()

    const logout = () => {
        fetch('/api/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setLoggedin(false);
                    router.push('/login');
                }
            })
            .catch(error => {
                console.error('Unable to logout', error);
            });
    }

    return (
        <header className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-[#159D7B] gap-2 ">
            <h1 className="order-1 text-2xl inline-block whitespace-nowrap font-bold text-white">Foci To-Do</h1>
            <div className="order-3 md:order-2 w-full md:max-w-2xl inline-flex gap-2 justify-center items-center">
                {isLoggedIn &&
                    <><SearchTodo/><SortTodo/></>
                }
            </div>
            <div className="order-2 md:order-3 flex items-center gap-4">
                <ThemeToggle/>
                {isLoggedIn &&
                    <Button variant={'ghost'} onClick={logout}>Logout</Button>
                }
            </div>
        </header>
    );
}
