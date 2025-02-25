'use client';
import {Input} from "@/components/ui/input";
import {AddTodoDialog} from "@/components/todo/components/add-todo-dialog";

export default function AddTodos() {
    return (
        <div className="flex flex-row justify-center items-center w-full gap-4">
            <Input type="text" placeholder="Search..." className="max-w-2xl md:text-2xl h-16"/>
            <AddTodoDialog/>
        </div>
    )
}
