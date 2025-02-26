'use client';
import Todo from "@/components/todo/todo";
import {AddEditTodoDialog} from "@/components/todo/components/add-edit-todo-dialog";


export default function Home() {
    return (
        <div className="relative h-full overflow-hidden">
            <div className="absolute right-8 top-6 z-10">
                <AddEditTodoDialog/>
            </div>
            <div className="flex flex-col justify-center items-center h-full w-full overflow-auto">
                <Todo/>
            </div>
        </div>

    );
}
