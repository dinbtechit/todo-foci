import {FilterTodo} from "@/components/todo/model/todo-model";

class TodoHttpClient {
    searchTodos = async (searchText: string, filterTodo: FilterTodo) => {
        const showBy = `showOnly=${filterTodo.showOnly}`
        const sortQuery = `${showBy}&groupByDates=${filterTodo.groupByDates}&sortGroupBy=${filterTodo.sortGroupBy}&sortBy=${filterTodo.sortBy}`
        const response = await fetch(`/api/todos/search?${sortQuery}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            body: JSON.stringify({
                searchText
            }),
        });
        if (!response.ok) throw new Error('Failed to fetch todos');
        return await response.json();
    }
}

export const todoHttpClient = new TodoHttpClient()