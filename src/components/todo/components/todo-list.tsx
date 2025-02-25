'use client';
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect} from "react";
import {AlarmClock, Ellipsis, Pencil, SquareCheckBig, Trash2} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {todoState} from "@/components/todo/state/todo-state";
import {useAtom} from "jotai";
import {useLoadTodos} from "@/components/todo/state/todo-state-hook";


export default function TodoList() {

    const [todos,] = useAtom(todoState)
    const {loadTodos} = useLoadTodos()
    //const [, setLoading] = useState(true)

    const completedCSS = `dark:border-green-200 dark:bg-green-500/30 dark:text-green-100
                                        border-green-400 bg-green-100 text-green-950`

    useEffect(() => {
        loadTodos()
    }, []);

    const deleteTodo = async (id: string) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        });
        const data = await response.json();
        console.log(data);
        await loadTodos()
    }

    const completedToggle = async (id: string) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"}
        });
        const data = await response.json();
        console.log(data);
        await loadTodos()
    }

    return (
        <>
            <div className="flex flex-row w-full gap-2">
                <div className="flex flex-col justify-start items-center md:p-5 md:mr-10">
                    <span className="text-red-400 text-lg">Mar</span>
                    <span className="text-4xl font-semibold">30</span>
                    <span className="text-sm mt-2 text-gray-400">2025</span>
                </div>
                <div className="flex flex-1 flex-wrap gap-5 border-l justify-start pl-8">
                    {todos.map((todo, i) => (
                        <div key={i} className="w-full relative">
                            <div className="bg-background absolute z-10 -top-2  rounded-xl">
                                {todo.completed && <span className={`pr-2 pl-2 pb-1 pt-1 text-xs border font-bold rounded-xl
                                            ${completedCSS}

                                         `}>Completed</span>
                                }
                            </div>
                            <Card className={todo.completed ? 'opacity-40 -z-10' : ''}>
                                <CardHeader className="flex flex-row justify-center items-center p-5">
                                    <div className="flex-1 space-y-2">
                                        <CardTitle className="inline-flex justify-center items-center">
                                            {todo.title}
                                            <Pencil className="ml-2 w-4 h-4 text-gray-400"/>
                                        </CardTitle>
                                        <CardDescription>
                                            <div className="inline-flex items-center flex-1">
                                                <AlarmClock/> <span className="ml-2">
                                                {Intl.DateTimeFormat('en-CA', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                }).format(new Date(todo.dueDate))}
                                            </span>
                                            </div>
                                        </CardDescription>
                                    </div>
                                    <div className="flex justify-center items-center h-full">

                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-2 rounded-xl hover:bg-gray-800"
                                            ><Ellipsis/></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {todo.completed ?
                                                    <>
                                                        <DropdownMenuItem onClick={() => completedToggle(todo.id)}>
                                                            <SquareCheckBig/>Mark as Pending</DropdownMenuItem>
                                                        <DropdownMenuSeparator/>
                                                    </> :
                                                    <>
                                                        <DropdownMenuItem onClick={() => completedToggle(todo.id)}>
                                                            <SquareCheckBig/>Mark as Completed</DropdownMenuItem>
                                                        <DropdownMenuSeparator/></>
                                                }

                                                <DropdownMenuItem onClick={() => deleteTodo(todo.id)}>
                                                    <Trash2/> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            <hr className="w-full md:ml-8 md:mr-8 mt-8"/>
        </>
    )
}

