import {Button} from "@/components/ui/button";
import {Check, Pencil, X} from "lucide-react";
import {useRef, useState} from "react";
import {useUpdateTodos} from "@/components/todo/state/todo-state-hook";
import {Todo} from "@/components/todo/model/todo-model";

type TodoTitleProps = {
    todo: Todo
}

export function TodoTitle({todo}: TodoTitleProps) {
    const [editing, setEditing] = useState(false);
    const {updateTodo} = useUpdateTodos()
    const titleEditRef = useRef<HTMLDivElement>(null);

    const updateTitle = async () => {
        if (titleEditRef.current) {
            const newTitle = titleEditRef.current.textContent?.replace(/&nbsp;/g, " ").trim() ?? ""
            // TODO - handle other sanitization when I have time.
            await updateTodo({id: todo.id, title: newTitle, dueDate: todo.dueDate, completed: todo.completed})
            setEditing(false)
        }
    }

    const onInput = async (event: React.KeyboardEvent<HTMLDivElement>) => {
        // When Enter key press
        if (event.key === "Enter") {
            event.preventDefault();
            await updateTitle();
        }
    }

    return (
        <div className="inline-flex items-center justify-center">
            {editing ? <div
                    ref={titleEditRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="border-b border-b-gray-500 pb-2 mb-2 outline-0"
                    onKeyDown={onInput}
                >
                    {todo.title}
                </div> :
                <div className="mb-2 pb-2 cursor-pointer" onClick={() => setEditing(true)}>{todo.title}</div>}
            {!editing ? (
                <Button variant="link"
                        className="-mt-5"
                        onClick={() => setEditing(true)}>
                    <Pencil className="dark:text-gray-300 text-gray-400"/>
                </Button>
            ) : (
                <div className="ml-4 -mt-2 inline-flex justify-center items-center gap-2">
                    <Button className="border border-green-500 bg-green-500/20 p-0 w-6 h-6"
                            onClick={() => updateTitle()}>
                        <Check className="text-green-900 dark:text-green-300"/>
                    </Button>
                    <Button className="border border-red-500 hover:bg-red-500/65 bg-red-500/20 p-0 w-6 h-6"
                            onClick={() => setEditing(false)}>
                        <X className="text-red-900 dark:text-red-300"/>
                    </Button>
                </div>
            )}
        </div>
    )

}