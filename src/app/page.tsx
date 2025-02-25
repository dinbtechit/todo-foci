'use client';
import Todo from "@/components/todo/todo";
import {AddTodoDialog} from "@/components/todo/components/add-todo-dialog";


export default function Home() {
    return (
        <div className="relative h-full overflow-hidden">
            <div className="absolute right-8 top-6 z-10">
                <AddTodoDialog/>
            </div>
            <div className="flex flex-col justify-center items-center h-full w-full overflow-auto">
                <Todo/>
            </div>
        </div>

    );
}
