import {NextApiRequest, NextApiResponse} from "next";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            // Logout
            case 'GET':
                // Clear the cookie
                res.setHeader('Set-Cookie', cookie.serialize('user', '', {
                    httpOnly: true,
                    sameSite: 'strict',
                    expires: new Date(0),
                    maxAge: -1,
                    path: '/'
                }))
                console.log('Logged out successfully');
                return res.json({message: "Logged out successfully"});

            // for all methods
            default:
                return res.status(405).json({error: 'Method Not Allowed'});
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}