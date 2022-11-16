// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {tokenCache} from "./tokenCache";

type Data = {
    name: string
}

export const getTopTen = async () =>{
    const res = await fetch('https://api.twitch.tv/helix/streams?language=it',{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${tokenCache.token}`,
            "Client-id": `${process.env.CLIENT_ID}`
        }
    })

    return await res.json();
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    res.status(200).json({ name: 'John Doe' })
}
