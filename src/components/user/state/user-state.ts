import {User} from "@/db/entities/user";
import {atom} from "jotai";


export const userState = atom<User>();
export const isLoggedInState = atom<boolean>();