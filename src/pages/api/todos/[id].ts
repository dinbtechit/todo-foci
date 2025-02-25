import {NextApiRequest, NextApiResponse} from "next";
import {AppDataSource, connectDB} from "@/db/db";
import {Todo} from "@/db/entities/todo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await connectDB();
    const todoRepo = AppDataSource.getRepository(Todo);

    const {id} = req.query;

    if (req.method === 'PUT') {
        if (!id) return res.status(400).json({error: 'ID is required'});
        const {title, dueDate, completed} = req.body;
        const todoToUpdate = await todoRepo.findOneBy({id} as Todo);
        if (!todoToUpdate) return res.status(404).json({error: 'Todo not found'});
        if (title) {
            todoToUpdate.title = title;
        }
        if (completed || completed === false) {
            todoToUpdate.completed = completed;
        }
        if (dueDate) {
            todoToUpdate.dueDate = dueDate;
        }
        await todoRepo.save(todoToUpdate);
        return res.status(200).json(todoToUpdate);
    }

    if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({error: "Post ID is required"});
        }

        const todoToDelete = await todoRepo.findOneBy({id} as Todo);
        if (!todoToDelete) return res.status(404).json({error: 'Todo not found'});
        await todoRepo.remove(todoToDelete);
        return res.status(200).json({message: `Todo ${id} - deleted successfully`});
    }

    return res.status(405).json({error: "Method Not Allowed"});
}
