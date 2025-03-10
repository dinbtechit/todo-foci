import type {NextApiRequest, NextApiResponse} from 'next';
import {AppDataSource, connectDB} from "@/db/db";
import {Todo} from "@/db/entities/todo";
import {SortBy} from "@/components/todo/model/todo-model";
import {FindOptionsOrder, FindOptionsWhere} from "typeorm";
import {User} from "@/db/entities/user";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const todoRepo = AppDataSource.getRepository(Todo);
    const {showOnly, sortBy} = req.query

    const userId = req.cookies.user ?? ''
    try {
        switch (req.method) {
            // Get all todos
            case 'GET':

                let orderBy: FindOptionsOrder<Todo> = {
                    dueDate: 'ASC',
                    title: 'ASC',
                }
                let whereClause: FindOptionsWhere<Todo> = {
                    user: {id: userId},
                }

                if (showOnly === 'completed') {
                    whereClause = {
                        user: {id: userId},
                        completed: true
                    };
                } else if (showOnly === 'inprogress') {
                    whereClause = {
                        user: {id: userId},
                        completed: false
                    };
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

                if (!userId) return res.status(400).json({error: 'User is required'});

                const todos = await todoRepo.find({
                    where: whereClause,
                    order: orderBy
                });
                return res.status(200).json(todos);

            // Create a new todo
            case 'POST':
                const {title, description, dueDate} = req.body;
                console.log('add server', new Date(dueDate).toLocaleDateString())
                if (!title) return res.status(400).json({error: 'Title is required'});
                if (!dueDate) return res.status(400).json({error: 'DueDate is required'});
                const createdAt = new Date();
                const user = {id: userId} as User
                const newTodo = todoRepo.create({title, description, dueDate, user, createdAt});
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