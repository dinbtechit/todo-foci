import type {NextApiRequest, NextApiResponse} from "next";
import {connectDB} from "@/db/db";
import {searchAndGroupTodosByDueDate} from "@/db/todo-repo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    try {
        switch (req.method) {
            // Get grouped Todos
            case 'POST':
                const {searchText} = req.body;
                console.log('searching...' + req.body);
                const todos = await searchAndGroupTodosByDueDate(searchText ?? '');
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