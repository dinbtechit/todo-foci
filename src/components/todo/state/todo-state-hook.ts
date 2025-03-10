import {filterTodoState, groupTodoByDateState, todoState} from "@/components/todo/state/todo-state";
import {useAtom} from "jotai";
import {todoHttpClient} from "@/services/todo-http-client";

export const useLoadTodos = () => {
    const [, setTodos] = useAtom(todoState)
    const [filterTodo,] = useAtom(filterTodoState)
    const loadTodos = async () => {
        const showBy = `showOnly=${filterTodo.showOnly}`
        const sortQuery = `${showBy}&groupByDates=${filterTodo.groupByDates}&sortGroupBy=${filterTodo.sortGroupBy}&sortBy=${filterTodo.sortBy}`
        const response = await fetch(`/api/todos?${sortQuery}`, {
            headers: {
                "Content-Type": "application/json",
                "x-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
            },
        });
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();
        setTodos(data);
    }
    return {loadTodos};
};

export const useLoadGroupTodosByDate = () => {
    const [, setTodosByDate] = useAtom(groupTodoByDateState)
    const [filterTodo,] = useAtom(filterTodoState)
    const loadTodosByDate = async () => {
        console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
        const showBy = `showOnly=${filterTodo.showOnly}`
        const sortQuery = `${showBy}&groupByDates=${filterTodo.groupByDates}&sortGroupBy=${filterTodo.sortGroupBy}&sortBy=${filterTodo.sortBy}`
        const response = await fetch(`/api/todos/group?${sortQuery}`, {
            headers: {
                "Content-Type": "application/json",
                "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
            },
        });
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();
        setTodosByDate(data);
    }
    return {loadTodosByDate};
};

export const useAddTodos = () => {
    const [filterTodo,] = useAtom(filterTodoState)
    const {loadTodos} = useLoadTodos();
    const {loadTodosByDate} = useLoadGroupTodosByDate();
    const addTodo = async (title: string, description: string, dueDate: Date) => {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            body: JSON.stringify({
                title: title,
                description: description,
                dueDate: `${dueDate}`
            }),
        });
        if (!response.ok) {
            console.error('Error creating todo');
            return;
        }
        if (filterTodo.groupByDates) {
            await loadTodosByDate();
        } else {
            await loadTodos();
        }
    }
    return {addTodo};
}

export const useUpdateTodos = () => {
    const {loadTodos} = useLoadTodos();
    const {loadTodosByDate} = useLoadGroupTodosByDate();
    const [filterTodo,] = useAtom(filterTodoState)
    const updateTodo = async (data: {
        id: string, title?: string, description?: string, dueDate?: Date, completed?: boolean
    }) => {
        const response = await fetch(`/api/todos/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            body: JSON.stringify({
                title: data.title,
                description: data.description,
                dueDate: `${data.dueDate}`,
                completed: data.completed,
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

export const useDeleteTodos = () => {
    const [filterTodo,] = useAtom(filterTodoState)
    const {loadTodos} = useLoadTodos()
    const {loadTodosByDate} = useLoadGroupTodosByDate()

    const deleteTodo = async (id: string) => {
        await fetch(`/api/todos/${id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        });
        if (filterTodo.groupByDates) {
            await loadTodosByDate()
        } else {
            await loadTodos()
        }
    }
    return {deleteTodo};
}

export const useSearchTodos = () => {
    const [, setTodosByDate] = useAtom(groupTodoByDateState)
    const [, setTodos] = useAtom(todoState)
    const [filterTodo,] = useAtom(filterTodoState)
    const search = async (searchText: string) => {
        const data = await todoHttpClient.searchTodos(searchText, filterTodo);
        if (filterTodo.groupByDates) {
            setTodosByDate(data)
        } else {
            setTodos(data)
        }
    }
    return {searchTodos: search};
}

