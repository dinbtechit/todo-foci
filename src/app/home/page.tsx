'use client';

import {AddEditTodoDialog} from "@/components/todo/components/add-edit-todo-dialog";
import Todo from "@/components/todo/todo";
import React, {useState} from "react";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function Home() {
    const [open, setOpen] = useState(false)

    const onDialogCLose = (input: boolean) => {
        setOpen(input)
    }

    return (
        <div className="relative h-full overflow-hidden">
            <div className="absolute right-8 top-6 z-10">
                <AddEditTodoDialog open={open} onCloseDialog={onDialogCLose}
                                   trigger={
                                       <Button className="w-320 rounded-2xl text-white font-semibold text-lg">
                                           <Plus className="scale-150 text-white"/> Create Todo
                                       </Button>
                                   }/>
            </div>
            <div className="flex flex-col justify-center items-center h-full w-full overflow-auto">
                <Todo/>
            </div>
        </div>

    );
}
