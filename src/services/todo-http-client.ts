class TodoHttpClient {
    searchTodos = async (searchText: string) => {
        const response = await fetch('/api/todos/search', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                searchText
            }),
        });
        if (!response.ok) throw new Error('Failed to fetch todos');
        return await response.json();
    }
}

export const todoHttpClient = new TodoHttpClient()