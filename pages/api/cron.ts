import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from "../../lib/dbConnect";
import Leaderboard from "../../models/Leaderboard";
import {getTopTen} from "./top10";
import {getToken, tokenCache} from "./tokenCache";
import Streamer from "../../interfaces/Streamer";
import StreamerCollection from '../../models/Streamer';

const scoreLeaderboard = [3, 1.75, 1];

// Allow date between 12pm - 2am
const isValidDate = ()=>{
    const startValidDate = new Date().setHours(12,0,0,0);
    const endValidDate = new Date().setHours(26,0,0,0);
    const dateNow = new Date().getTime();
    return ((dateNow >= startValidDate) && (dateNow <= endValidDate))
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (isValidDate() && req.method === 'POST') {
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
           for (const [i,streamer] of pointList.entries()) {
               // @ts-ignore
               await StreamerCollection.findOneAndUpdate({id:streamer.idStreamer },{$inc: {'totalPoints':streamer.points},username: topThree[i].user_name},{upsert: true})
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
