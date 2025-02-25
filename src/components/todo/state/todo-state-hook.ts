import {groupTodoByDateState, todoState} from "@/components/todo/state/todo-state";
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

export const useLoadGroupTodosByDate = () => {
    const [, setTodosByDate] = useAtom(groupTodoByDateState)
    const loadTodosByDate = async () => {
        const response = await fetch('/api/todos/group');
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();
        console.log(data)
        setTodosByDate(data);
    }
    return {loadTodosByDate};
};

export const useUpdateTodos = () => {
    const {loadTodos} = useLoadTodos();
    const {loadTodosByDate} = useLoadGroupTodosByDate();
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
        await loadTodosByDate()
    }

    return {updateTodo};
};


export const useSearchTodos = () => {
    const [, setTodosByDate] = useAtom(groupTodoByDateState)
    const searchTodos = async (searchText: string) => {
        const response = await fetch('/api/todos/search', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                searchText
            }),
        });
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();
        setTodosByDate(data)
    }
    return {searchTodos};
};
