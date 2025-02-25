import {todoState} from "@/components/todo/state/todo-state";
import {useAtom} from "jotai";

export const useLoadTodos = () => {
    const [, setTodos] = useAtom(todoState)
    const loadTodos = async () => {
        const response = await fetch('/api/todos');
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();
        setTodos(data);
    }
    return {loadTodos};
};

export const useUpdateTodos = () => {
    const {loadTodos} = useLoadTodos();
    const updateTodo = async (id: string, title?: string, dueDate?: Date, completed?: boolean) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: title,
                dueDate: dueDate,
                completed: completed,
            }),
        });
        if (!response.ok) throw new Error('Failed to update todos');
        await loadTodos()
    }

    return {updateTodo};
};


export const useSearchTodos = () => {
    const [, setTodos] = useAtom(todoState)
    const searchTodos = async () => {
        const response = await fetch('/api/todos');
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();
        setTodos(data);
    }
    return {searchTodos};
};
