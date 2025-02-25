import {GroupTodosByDate, Todo} from "@/components/todo/model/todo-model";
import {atom} from "jotai";


export const todoState = atom<Todo[]>([]);
export const groupTodoByDateState = atom<GroupTodosByDate[]>([]);