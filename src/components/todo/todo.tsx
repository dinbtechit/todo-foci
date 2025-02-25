import TodoList from "@/components/todo/components/todo-list";
import AddTodos from "@/components/todo/components/add-todos";

export default function Todo() {
    return (
        <div
            className="flex flex-col justify-start items-center h-full w-full mt-8 container p-8 md:p-0">
            <AddTodos/>
            <div className="mt-16 w-full flex flex-col justify-center items-center">
                <TodoList/>
            </div>
        </div>
    )
}