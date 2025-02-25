'use client';
import {Input} from "@/components/ui/input";
import {AddTodoDialog} from "@/components/todo/components/add-todo-dialog";
import {Button} from "@/components/ui/button";
import {useSearchTodos} from "@/components/todo/state/todo-state-hook";
import {useState} from "react";

export default function AddTodos() {
    const {searchTodos} = useSearchTodos()
    const [searchText, setSearchText] = useState("");
    return (
        <div className="flex flex-row justify-center items-center w-full gap-4">
            <Input type="text" placeholder="Search..."
                   onInput={(e) => setSearchText((e.target as HTMLInputElement).value)}
                   className="max-w-2xl md:text-2xl h-16"/>
            <Button onClick={() => searchTodos(searchText)}>Search</Button>
            <AddTodoDialog/>
        </div>
    )
}
