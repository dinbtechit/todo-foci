import {Todo} from "@/components/todo/model/todo-model";
import {atom} from "jotai";


export const todoState = atom<Todo[]>([]);