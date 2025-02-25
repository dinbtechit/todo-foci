'use client';
import {Input} from "@/components/ui/input";
import {Plus} from "lucide-react";
import {useLoadTodos} from "@/components/todo/state/todo-state-hook";

export default function AddTodos() {

    const {loadTodos} = useLoadTodos()

    const addTodo = async () => {
        const response = await fetch("/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Birthday Cake2",
            }),
        });

        if (!response.ok) {
            console.error("Error creating todo");
            return;
        }

        const data = await response.json();
        console.log("Todo created:", data);
        loadTodos()
    }

    return (
        <div className="flex flex-row justify-center items-center w-full">
            <Input type="text" placeholder="Search..." className="max-w-2xl md:text-2xl h-16"/>

            <div onClick={addTodo}
                 className="ml-2 h-full inline-flex justify-center rounded cursor-pointer
                           items-center w-28 bg-[#1F2937] hover:bg-[#1F2937]/60">
                <Plus className="w-16 h-16  text-white"/>
            </div>
        </div>
    )
}