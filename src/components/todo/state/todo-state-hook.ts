import {filterTodoState, groupTodoByDateState, todoState} from "@/components/todo/state/todo-state";
import {useAtom} from "jotai";
import {todoHttpClient} from "@/services/todo-http-client";

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
        setTodosByDate(data);
    }
    return {loadTodosByDate};
};

export const useUpdateTodos = () => {
    const {loadTodos} = useLoadTodos();
    const {loadTodosByDate} = useLoadGroupTodosByDate();
    const [filterTodo,] = useAtom(filterTodoState)
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
        if (filterTodo.groupByDates) {
            await loadTodosByDate()
        } else {
            await loadTodos()
        }
    }

    return {updateTodo};
};


export const useSearchTodos = () => {
    const [, setTodosByDate] = useAtom(groupTodoByDateState)
    const search = async (searchText: string) => {
        const data = await todoHttpClient.searchTodos(searchText);
        setTodosByDate(data)
    }
    return {searchTodos: search};
};
