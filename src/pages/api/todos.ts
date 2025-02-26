import type {NextApiRequest, NextApiResponse} from 'next';
import {AppDataSource, connectDB} from "@/db/db";
import {Todo} from "@/db/entities/todo";
import {User} from "@/db/entities/user";
import {SortBy} from "@/components/todo/model/todo-model";
import {FindOptionsOrder, FindOptionsWhere} from "typeorm";
import cookie from "cookie";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const todoRepo = AppDataSource.getRepository(Todo);
    const {sortBy} = req.query
    const cookies = cookie.parse(req.headers.cookie || '');
    const userId = cookies?.user ?? '';
    const user = {id: userId} as User;

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

                if (!user) return res.status(400).json({error: 'User is required'});

                const todos = await todoRepo.find({
                    where: {user: {id: user.id}} as FindOptionsWhere<Todo>,
                    order: orderBy
                });
                return res.status(200).json(todos);

            // Create a new todo
            case 'POST':
                const {title, dueDate} = req.body;
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