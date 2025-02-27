'use client';
import {Todo} from "@/components/todo/model/todo-model";

type TodoTitleProps = {
    todo: Todo
}

export function TodoTitle({todo}: TodoTitleProps) {
    return (
        <div className="inline-flex items-center justify-center">
            <div className="mb-2 pb-2 text-xl cursor-pointer">{todo.title}</div>
            <div className="inline-flex items-center flex-1">
                {/*<AddEditTodoDialog open={isOpen} onCloseDialog={onDialogClose} todo={todo} trigger={
                    <Button variant="link"
                            className="-mt-4">
                        <Pencil className="text-gray-600 dark:text-gray-300"/>
                    </Button>
                }/>*/}
            </div>

        </div>
    )

}