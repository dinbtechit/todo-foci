import type {NextApiRequest, NextApiResponse} from "next";
import {connectDB} from "@/db/db";
import {getGroupedTodos} from "@/db/todo-repo";
import {SortBy, SortGroupBy} from "@/components/todo/model/todo-model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const {sortGroupBy, sortBy} = req.query
    try {
        switch (req.method) {
            // Get grouped Todos
            case 'GET':
                const todos = await getGroupedTodos({
                    sortGroupBy: sortGroupBy as SortGroupBy,
                    sortBy: sortBy as SortBy
                });
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