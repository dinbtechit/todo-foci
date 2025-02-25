'use client';
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect} from "react";
import {AlarmClock, Ellipsis, SquareCheckBig, Trash2} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {groupTodoByDateState, todoState} from "@/components/todo/state/todo-state";
import {useAtom} from "jotai";
import {useLoadGroupTodosByDate, useLoadTodos} from "@/components/todo/state/todo-state-hook";
import {TodoTitle} from "@/components/todo/components/todo-title";
import {Todo} from "@/components/todo/model/todo-model";


export default function TodoList() {

    const [todos,] = useAtom(todoState)
    const [todosGroupedByDate,] = useAtom(groupTodoByDateState)
    const {loadTodos} = useLoadTodos()
    const {loadTodosByDate} = useLoadGroupTodosByDate()
    //const [, setLoading] = useState(true)


    const completedCSS = `dark:border-green-200 dark:bg-green-500/30 dark:text-green-100
                                        border-green-400 bg-green-100 text-green-950`

    useEffect(() => {
        //loadTodos()
        /*const loadGroupTodos = async () => {
            const response = await fetch('/api/todos/group');
            if (!response.ok) throw new Error('Failed to fetch todos');
            const data = await response.json();
            console.log(data)
        }
        loadGroupTodos()*/
        loadTodosByDate()

    }, []);

    const deleteTodo = async (id: string) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        });
        await response.json();
        await loadTodos()
        await loadTodosByDate();
    }

    const completedToggle = async (id: string, completed: boolean) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                completed: completed,
            })
        });
        await response.json();
        await loadTodos()
        await loadTodosByDate();
    }

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return new Date(Number(year), Number(month) - 1, Number(day));
    };

    return (
        todosGroupedByDate.map((group, i) => (
            <div key={i} className="w-full">
                <div className="flex flex-row w-full gap-2 mt-4 ">
                    <div className="flex flex-col justify-start items-center md:p-5 md:mr-10">
                        <span
                            className="text-red-400 text-lg">{
                            Intl.DateTimeFormat('en-US', {month: 'short'}).format(formatDate(group.date))
                        }</span>
                        <span
                            className="text-4xl font-semibold">{Intl.DateTimeFormat('en-CA', {day: '2-digit'}).format(formatDate(group.date))}</span>
                        <span
                            className="text-sm mt-2 text-gray-400">{Intl.DateTimeFormat('en-CA', {year: 'numeric'}).format(new Date(group.date))}</span>
                    </div>
                    <div className="flex flex-1 flex-wrap w-full gap-5 border-l justify-start pl-8">
                        {group.todos.map((todo, i) => (
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
                                                <TodoTitle todo={todo}/>
                                            </CardTitle>
                                            <CardDescription>
                                                <div className="inline-flex items-center flex-1">
                                                    <AlarmClock/> <span className="ml-2">
                                                {Intl.DateTimeFormat('en-CA', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
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
                                                            <DropdownMenuItem
                                                                onClick={() => completedToggle(todo.id, false)}>
                                                                <SquareCheckBig/>Mark as Pending</DropdownMenuItem>
                                                            <DropdownMenuSeparator/>
                                                        </> :
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => completedToggle(todo.id, true)}>
                                                                <SquareCheckBig/>Mark as
                                                                Completed</DropdownMenuItem>
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
            </div>
        ))
    )
}


function TodosList(prop: { todos: Todo[] }) {

    const {loadTodos} = useLoadTodos()

    const completedCSS = `dark:border-green-200 dark:bg-green-500/30 dark:text-green-100
                                        border-green-400 bg-green-100 text-green-950`

    const deleteTodo = async (id: string) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        });
        await response.json();
        await loadTodos()
    }

    const completedToggle = async (id: string, completed: boolean) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                completed: completed,
            })
        });
        await response.json();
        await loadTodos()
    }

    return (<div className="flex flex-1 flex-wrap gap-5 border-l justify-start pl-8">
        {prop.todos.map((todo, i) => (
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
                                <TodoTitle todo={todo}/>
                            </CardTitle>
                            <CardDescription>
                                <div className="inline-flex items-center flex-1">
                                    <AlarmClock/> <span className="ml-2">
                                                {Intl.DateTimeFormat('en-CA', {
                                                    dateStyle: 'full',
                                                    timeStyle: 'short',
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
                                            <DropdownMenuItem
                                                onClick={() => completedToggle(todo.id, false)}>
                                                <SquareCheckBig/>Mark as Pending</DropdownMenuItem>
                                            <DropdownMenuSeparator/>
                                        </> :
                                        <>
                                            <DropdownMenuItem
                                                onClick={() => completedToggle(todo.id, true)}>
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
    </div>)
}
