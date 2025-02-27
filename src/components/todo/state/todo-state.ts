import {FilterTodo, GroupTodosByDate, Todo} from "@/components/todo/model/todo-model";
import {atom} from "jotai";


export const todoState = atom<Todo[]>([]);
export const groupTodoByDateState = atom<GroupTodosByDate[]>([]);
export const filterTodoState = atom<FilterTodo>({
    showOnly: 'all',
    groupByDates: true,
    sortGroupBy: 'asc',
    sortBy: 'date_asc'
})