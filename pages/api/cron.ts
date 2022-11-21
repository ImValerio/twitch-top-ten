import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'POST') {
        try {
           checkAuthToken(req,res);


        } catch ({message}) {
            res.status(500).json({ statusCode: 500, message});
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}

const checkAuthToken = (req:NextApiRequest,res: NextApiResponse)=> {

    const { authorization } = req.headers;

    if (authorization === `Bearer ${process.env.CRON_SECRET_KEY}`) {
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
}
