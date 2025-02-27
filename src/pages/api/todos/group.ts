import type {NextApiRequest, NextApiResponse} from "next";
import {connectDB} from "@/db/db";
import {getGroupedTodos} from "@/db/todo-repo";
import {FilterTodo, SortBy, SortGroupBy} from "@/components/todo/model/todo-model";
import {User} from "@/db/entities/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const {showOnly, sortGroupBy, sortBy} = req.query

    const filterByTodo = {
        showOnly,
        sortGroupBy: sortGroupBy as SortGroupBy,
        sortBy: sortBy as SortBy
    } as FilterTodo

    try {
        switch (req.method) {
            // Get grouped Todos
            case 'GET':
                const userId = req.cookies.user
                const user = {id: userId} as User;
                const todos = await getGroupedTodos(user, filterByTodo);
                return res.status(200).json(todos);

            // for all methods
            default:
                return res.status(405).json({error: 'Method Not Allowed'});
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}