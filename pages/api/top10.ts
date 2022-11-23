// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {EXPIRE_LIMIT, getToken, tokenCache} from "./tokenCache";
import {GetServerSidePropsContext} from "next";
import Streamer from "../../interfaces/Streamer";
import {getProfileImgByIDS} from "../index";

type Data = {
    name: string
}

export const getTopTen = async () =>{
    const res: Response = await fetch('https://api.twitch.tv/helix/streams?language=it',{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${tokenCache.token}`,
            "Client-id": `${process.env.CLIENT_ID}`
        }
    })
    const {data} = await res.json();
    data.length = 10;
    return data;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    res.status(200).json({ name: 'John Doe' })
}
