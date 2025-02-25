export interface Todo {
    id: string;
    title: string;
    dueDate: Date;
    completed: boolean;
}

export type GroupTodosByDate = { date: string, todos: Todo[] }
