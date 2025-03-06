import TodoList from "@/components/todo/components/todo-list";


export default function Todo() {
    return (
        <>
            <div
                className="flex flex-col justify-start items-center h-full w-full mt-8 container p-3 md:p-0">
                <div className="mt-6 md:mt-8 w-full flex flex-col justify-center items-center">
                    <TodoList/>
                </div>
            </div>
        </>
    )
}