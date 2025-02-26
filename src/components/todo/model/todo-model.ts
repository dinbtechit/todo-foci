export interface Todo {
    id: string;
    title: string;
    dueDate: Date;
    completed: boolean;
}

export type GroupTodosByDate = { date: string, todos: Todo[] }
export type SortBy = 'date_asc' | 'date_desc' | 'title_asc' | 'title_desc' | string
export type SortGroupBy = 'asc' | 'desc' | string
export type FilterTodo = { groupByDates: boolean, sortGroupBy: SortGroupBy, sortBy: SortBy }
