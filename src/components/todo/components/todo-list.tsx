'use client';
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {AlarmClock, Ellipsis, Pencil, SquareCheckBig, Trash2, Undo} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {filterTodoState, groupTodoByDateState, todoState} from "@/components/todo/state/todo-state";
import {useAtom} from "jotai";
import {
    useDeleteTodos,
    useLoadGroupTodosByDate,
    useLoadTodos,
    useUpdateTodos
} from "@/components/todo/state/todo-state-hook";
import {TodoTitle} from "@/components/todo/components/todo-title";
import {GroupTodosByDate, Todo} from "@/components/todo/model/todo-model";
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {AddEditTodoDialog} from "@/components/todo/components/add-edit-todo-dialog";


export default function TodoList() {

    const [todos,] = useAtom(todoState)
    const [todosGroupedByDate,] = useAtom(groupTodoByDateState)
    const {loadTodos} = useLoadTodos()
    const {loadTodosByDate} = useLoadGroupTodosByDate()
    const [filterTodo,] = useAtom(filterTodoState)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const load = async () => {
            if (filterTodo.groupByDates) {
                await loadTodosByDate()
            } else {
                await loadTodos()
            }
            setLoading(false)
        }
        load()
    }, [filterTodo]);

    const todoList = filterTodo.groupByDates ? <GroupedTodoList todos={todosGroupedByDate}/> :
        <SingleViewTodoList todos={todos}/>
    const todoLoading = filterTodo.groupByDates ? <GroupedTodoListSkeleton/> : <SingleViewTodoListSkeleton/>

    return !loading ? todoList : todoLoading
}


function SingleViewTodoList(prop: { todos: Todo[] }) {
    return (
        <div className="flex flex-col gap-5 md:max-w-5xl w-full justify-start mt-8 mb-8">
            {prop.todos.length === 0 &&
                <div className="text-center text-gray-500 dark:text-gray-400">No todos found</div>}
            {prop.todos.map((todo, i) => (
                <div key={i} className="w-full relative mt-4">
                    <TodoStatus todo={todo}/>
                    <TodoCard todo={todo}/>

                </div>
            ))}
        </div>)
}

function SingleViewTodoListSkeleton() {
    return (
        <div className="flex flex-col gap-5 md:max-w-5xl w-full justify-start mt-8">
            {[1, 2].map((todo, i) => (
                <div key={i} className="w-full relative mt-4">
                    <Skeleton key={i} className="h-[6em] w-full"/>
                </div>
            ))}
        </div>)
}

function GroupedTodoList(props: { todos: GroupTodosByDate[] }) {
    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return new Date(Number(year), Number(month) - 1, Number(day));
    };

    if (props.todos.length === 0) return (
        <div className="text-center text-gray-500 dark:text-gray-400">No todos found</div>
    )

    return (
        props.todos.map((group, i) => (
            <div key={i} className="flex flex-row w-full gap-0 mt-4">
                <div
                    className="flex flex-col justify-start w-[8.0em] h-full shadow rounded-l-2xl border border-gray-500/20 border-r-0 bg-gray-100 dark:bg-black/30 items-center pl-2 pt-1 md:pt-2 space-y-0">
                                <span
                                    className="text-red-500 text-lg">{Intl.DateTimeFormat('en-US', {month: 'short'}).format(formatDate(group.date))}</span>
                    <span
                        className="text-4xl font-semibold">{Intl.DateTimeFormat('en-CA', {day: '2-digit'}).format(formatDate(group.date))}</span>
                    <span
                        className="text-sm mt-2 text-gray-400">{Intl.DateTimeFormat('en-CA', {year: 'numeric'}).format(formatDate(group.date))}</span>
                </div>
                <div className="w-full  border-l-4  rounded-r-2xl pr-4
                             bg-gray-200 dark:bg-gray-400/5">
                    <div
                        className="flex flex-1 flex-col w-full gap-5 mt-4 mb-4 justify-start p-1 md:p-2 md:pl-6 md:pt-1">
                        {group.todos.map((todo, i) => (
                            <div key={i} className="w-full relative">
                                <TodoStatus todo={todo} className="-top-2 "/>
                                <TodoCard todo={todo} headerClassName="p-5"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))
    )
}

function GroupedTodoListSkeleton() {
    return (
        [1, 2].map((_, i) => (
            <div key={i} className="flex flex-row w-full gap-0 mt-4">
                <div
                    className="flex flex-col justify-start w-[8.0em] h-full shadow rounded-l-2xl bg-gray-100 dark:bg-black/30 items-center pl-2 pt-1 md:pt-2 space-y-2">
                    <Skeleton className="h-[1em] w-10"/>
                    <Skeleton className="h-[2em] w-20"/>
                    <Skeleton className="h-[1em] w-10"/>
                </div>
                <div className="w-full  border-l-4 border-t border-b border-r rounded-r-2xl pr-4
                             bg-gray-200 dark:bg-black/10 dark:border-black/20">
                    <div
                        className="flex flex-1 flex-col w-full gap-5 mt-4 mb-4 justify-start p-1 md:p-2 md:pl-6 md:pt-1">
                        {[1, 2].map((_, i) => (
                            <Skeleton key={i} className="h-[6em] w-full"/>
                        ))}
                    </div>
                </div>

            </div>
        ))
    )
}

function TodoStatus(props: { todo: Todo, className?: string }) {

    const completedCSS = `dark:border-green-200 dark:bg-green-500/30 dark:text-green-100
                                        border-green-400 bg-green-100 text-green-950`
    const overDueCSS = `dark:border-yellow-200 dark:bg-yellow-500/30 dark:text-orange-100
                                        border-yellow-400 bg-yellow-100 text-orange-950`

    const isOverDue = new Date(props.todo.dueDate) < new Date()

    return (
        <div className={`bg-background absolute z-10 -top-4  rounded-xl ${props.className}`}>
            {props.todo.completed &&
                <span className={`pr-2 pl-2 pb-1 pt-1 text-xs border font-bold rounded-xl ${completedCSS}`}>
                Completed
            </span>
            }
            {!props.todo.completed && isOverDue &&
                <span className={`pr-2 pl-2 pb-1 pt-1 text-xs border font-bold rounded-xl ${overDueCSS}`}>
                Overdue
            </span>
            }
        </div>)
}

function TodoCard(props: { todo: Todo, className?: string, headerClassName?: string }) {
    const [filterTodo,] = useAtom(filterTodoState)
    return <Card
        className={cn("dark:bg-black/30 shadow border border-gray-500/70", props.todo.completed ? "opacity-40 -z-10" : "", props.className)}>
        <CardHeader className={`flex flex-row justify-center items-center p-0 pr-5 ${props.headerClassName}`}>
            <div className="flex-1">
                <CardTitle className="inline-flex justify-center items-center">
                    {!filterTodo.groupByDates &&
                        <div className="flex flex-col items-center space-y-0 mr-5
                                        bg-gray-100 dark:bg-black/30 rounded-l-xl border-r h-full w-28 p-6">
                                        <span
                                            className="text-red-400">{
                                            Intl.DateTimeFormat("en-CA", {month: "short"}).format(new Date(props.todo.dueDate))
                                        }</span>
                            <span
                                className="text-3xl font-semibold">{Intl.DateTimeFormat("en-CA", {day: "2-digit"}).format(new Date(props.todo.dueDate))}</span>
                            <span
                                className="text-sm mt-2 text-gray-400">{Intl.DateTimeFormat("en-CA", {year: "numeric"}).format(new Date(props.todo.dueDate))}</span>
                        </div>
                    }
                    <div className="flex flex-col items-start flex-1">
                        <TodoTitle todo={props.todo}/>
                        <span
                            className="inline-flex -mt-2 hover:bg justify-center items-center text-xs mb-5 gap-2 text-gray-400/90">
                            <AlarmClock className="w-4 h-4"/>

                            {Intl.DateTimeFormat("en-CA", {
                                timeStyle: "short",
                                hour12: true,
                            }).format(new Date(props.todo.dueDate))}
                        </span>
                        <CardDescription className="">
                            {props.todo.description}
                        </CardDescription>
                    </div>
                </CardTitle>

            </div>
            <div className="flex justify-start items-start h-full">
                <Action todo={props.todo}/>
            </div>
        </CardHeader>
    </Card>;
}

function Action(props: { todo: Todo }) {

    const {updateTodo} = useUpdateTodos()
    const {deleteTodo} = useDeleteTodos()
    const [isOpen, setIsOpen] = useState(false)

    const onDialogClose = (input: boolean) => {
        setIsOpen(input)
    }


    const completedToggle = async (id: string, completed: boolean) => {
        await updateTodo({id: id, completed: completed})
    }

    return (
        <><AddEditTodoDialog todo={props.todo} open={isOpen} onCloseDialog={onDialogClose}/><DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-xl dark:hover:bg-gray-800 hover:bg-gray-200"
            ><Ellipsis/></DropdownMenuTrigger>
            <DropdownMenuContent>
                {props.todo.completed ?
                    <>
                        <DropdownMenuItem
                            onClick={() => completedToggle(props.todo.id, false)}>
                            <Undo/> Undo Complete</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                    </> :
                    <>
                        <DropdownMenuItem
                            onClick={() => completedToggle(props.todo.id, true)}>
                            <SquareCheckBig/>Mark as Completed</DropdownMenuItem>
                        <DropdownMenuSeparator/></>}
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                    <Pencil/> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteTodo(props.todo.id)}>
                    <Trash2/> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu></>);
}