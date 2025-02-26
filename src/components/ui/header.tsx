'use client';
import {ThemeToggle} from "@/components/ui/theme-toggle";
import SortTodo from "@/components/todo/components/sort-todo";
import SearchTodo from "@/components/todo/components/search-todo";
import {useRouter} from "next/navigation";
import {isLoggedInState, userState} from "@/components/user/state/user-state";
import {useAtom} from "jotai";
import {useEffect} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown, User} from "lucide-react";

export default function Header() {
    const [isLoggedIn, setLoggedin] = useAtom(isLoggedInState)
    const router = useRouter()
    const [user, setUser] = useAtom(userState)

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch('/api/user', {method: 'GET',})
                const user = await res.json()
                console.log(user);
                setUser(user)
            } catch (e: unknown) {
                setUser(null)
                console.log(e)
            }
        }
        loadUser()
    }, [isLoggedIn]);

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
                    setUser(null);
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
                {user &&
                    <><SearchTodo/><SortTodo/></>
                }
            </div>
            <div className="order-2 md:order-3 flex items-center gap-4">
                <ThemeToggle/>
                {user &&
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="inline-flex justify-between gap-2 rounded-lg shadow text-white bg-black/95 hover:bg-gray-800/90 p-2 min-w-40">
                            <span className="inline-flex gap-2 capitalize"><User/> {user?.email}</span> <ChevronDown/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                }
            </div>
        </header>
    );
}
