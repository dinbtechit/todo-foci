import {todoState} from "@/components/todo/state/todo-state";
import {useAtom} from "jotai";

export const useLoadTodos = () => {
    const [, setTodos] = useAtom(todoState)

    const loadTodos = async () => {
        const response = await fetch('/api/todos');
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();
        setTodos(data);
        console.log(data)
    }
    return {loadTodos};
};
