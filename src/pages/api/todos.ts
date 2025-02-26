import type {NextApiRequest, NextApiResponse} from 'next';
import {AppDataSource, connectDB} from "@/db/db";
import {Todo} from "@/db/entities/todo";
import {User} from "@/db/entities/user";
import {SortBy} from "@/components/todo/model/todo-model";
import {FindOptionsOrder} from "typeorm";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const todoRepo = AppDataSource.getRepository(Todo);
    const {sortBy} = req.query

    try {
        switch (req.method) {
            // Get all todos
            case 'GET':
                let orderBy: FindOptionsOrder<Todo> = {
                    dueDate: 'ASC',
                    title: 'ASC',
                }
                if (sortBy && (sortBy as SortBy) === 'date_desc') {
                    orderBy = {
                        dueDate: 'DESC',
                        title: 'ASC',
                    }
                }
                if (sortBy && (sortBy as SortBy) === 'title_asc') {
                    orderBy = {
                        title: 'ASC',
                        dueDate: 'ASC',
                    }
                }
                if (sortBy && (sortBy as SortBy) === 'title_desc') {
                    orderBy = {
                        title: 'DESC',
                        dueDate: 'ASC',
                    }
                }
                const todos = await todoRepo.find({
                    order: orderBy
                });
                return res.status(200).json(todos);

            // Create a new todo
            case 'POST':
                const {title, dueDate} = req.body;
                const user = {id: "b47cfce4-771f-4d89-9502-1fc366844cd6"} as User;
                if (!title) return res.status(400).json({error: 'Title is required'});
                if (!dueDate) return res.status(400).json({error: 'DueDate is required'});
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