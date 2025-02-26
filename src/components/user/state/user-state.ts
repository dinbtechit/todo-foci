import {User} from "@/db/entities/user";
import {atom} from "jotai";


export const userState = atom<User | null>();
export const isLoggedInState = atom<boolean>();