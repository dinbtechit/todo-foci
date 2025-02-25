import type {NextApiRequest, NextApiResponse} from 'next';
import {AppDataSource, connectDB} from "@/db/db";
import {Todo} from "@/db/entities/todo";
import {User} from "@/db/entities/user";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const todoRepo = AppDataSource.getRepository(Todo);

    try {
        switch (req.method) {
            // Get all todos
            case 'GET':
                const todos = await todoRepo.find({
                    order: {
                        dueDate: 'ASC'
                    }
                });
                return res.status(200).json(todos);

            // Create a new todo
            case 'POST':
                const {title} = req.body;
                const user = {id: "b47cfce4-771f-4d89-9502-1fc366844cd6"} as User;
                console.log(title);
                if (!title) return res.status(400).json({error: 'Title is required'});
                //if (!dueDate) return res.status(400).json({error: 'DueDate is required'});
                const dueDate = new Date();
                const createdAt = new Date();
                const newTodo = todoRepo.create({title, dueDate, user, createdAt});
                await todoRepo.save(newTodo);
                return res.status(201).json(newTodo);
            // for all methods
            default:
                return res.status(405).json({error: 'Method Not Allowed'});
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}