import type {NextApiRequest, NextApiResponse} from "next";
import {getUserByEmail, getUserById, registerUser} from "@/db/user-repo";
import {connectDB} from "@/db/db";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    try {
        switch (req.method) {
            case 'GET':
                const userId = req.cookies.user
                console.log('userId', userId);
                if (!userId) return res.status(200).json(null);
                const userRepo = await getUserById(userId);
                return res.status(200).json(userRepo);

            case 'POST':
                const {email} = req.body;
                if (!email) return res.status(400).json({error: 'Email is required'});
                let userData = await getUserByEmail(email);
                if (!userData) {
                    userData = await registerUser(email);
                }

                if (!userData) return res.status(400).json({error: 'No User found'});
                console.log(userData)
                res.setHeader('Set-Cookie', `user=${userData.id}; Max-Age=3600; Path=/; HttpOnly; Secure; SameSite=Strict`);
                return res.json({message: "Login successful"});

            default:
                return res.status(405).json({error: 'Method Not Allowed'});
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}