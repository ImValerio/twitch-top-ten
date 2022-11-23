import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from "../../lib/dbConnect";
import Leaderboard from "../../models/Leaderboard";
import {getTopTen} from "./top10";
import {getToken, tokenCache} from "./tokenCache";
import Streamer from "../../interfaces/Streamer";
import StreamerCollection from '../../models/Streamer';

const scoreLeaderboard = [3, 1.75, 1];

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'POST') {
        try {
           if(!isAuth(req,res))
               throw({message:'Not authorized'});

           await connectDB();
           tokenCache.token = await getToken();
           let topThree = await getTopTen();
           topThree.length = 3;

           const pointList = topThree.map((streamer:Streamer, i: number) => {
               return {
                   idStreamer: streamer.user_id,
                   points: scoreLeaderboard[i],
                   createdAt: new Date(),
               }
            });

           await Leaderboard.insertMany(pointList);
           for (const streamer of pointList) {
               await StreamerCollection.findOneAndUpdate({id:streamer.idStreamer},{$inc: {'totalPoints':streamer.points}},{upsert: true})
           }
            res.status(200).json({ pointList,success: true});
        } catch ({message}) {
            res.status(500).json({ statusCode: 500, message});
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}

const isAuth = (req:NextApiRequest,res: NextApiResponse)=> {

    const { authorization } = req.headers;

    return authorization === `Bearer ${process.env.CRON_SECRET}`;
}
