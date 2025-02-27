export interface Todo {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
}

export type GroupTodosByDate = { date: string, todos: Todo[] }
export type SortBy = 'date_asc' | 'date_desc' | 'title_asc' | 'title_desc' | string
export type SortGroupBy = 'asc' | 'desc' | string
export type ShowOnly = 'completed' | 'inprogress' | 'all' | string
export type FilterTodo = {
    showOnly: ShowOnly,
    groupByDates: boolean,
    sortGroupBy: SortGroupBy,
    sortBy: SortBy
}
