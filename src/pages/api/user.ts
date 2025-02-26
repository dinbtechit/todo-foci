import type {NextApiRequest, NextApiResponse} from "next";
import {connectDB} from "@/db/db";
import {getUserByEmail, registerUser} from "@/db/user-repo";
import cookie from "cookie";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    try {
        switch (req.method) {
            // Get User Profile
            case 'GET':
                const cookies = cookie.parse(req.headers.cookie || '');
                const userId = cookies?.user ?? '';
                const userRepo = await getUserByEmail(userId);
                return res.status(200).json(userRepo);

            // Create a new todo
            case 'POST':
                const {email} = req.body;
                if (!email) return res.status(400).json({error: 'Title is required'});
                let user = await getUserByEmail(email);
                if (!user) {
                    user = await registerUser(email);
                }
                res.setHeader(
                    "Set-Cookie",
                    cookie.serialize("user", user.id, {
                        httpOnly: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 13600,
                    })
                );
                return res.json({
                    message: "Login successful"
                });

            // for all methods
            default:
                return res.status(405).json({error: 'Method Not Allowed'});
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}