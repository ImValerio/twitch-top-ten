import {useEffect, useState} from "react";
import Streamer from "../interfaces/Streamer";
import {DateTime} from "ts-luxon";
import Head from "next/head";
import {GetServerSidePropsContext} from "next";
import {EXPIRE_LIMIT, getToken, tokenCache} from "./api/tokenCache";
import {getProfileImgByIDS} from "./index";

export default function Leaderboard({data, imgs}:any) {
    const leaderBoardEmoji = [
        '🥇', '🥈', '🥉'
    ]

    return ( <h1>Developing...</h1>
        // <div className='main-container'>
        //     <Head>
        //         <title>Leaderboard</title>
        //         <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        //     </Head>
        //     <h1 className='title'>TOP 5</h1>
        //     <div className='container'>
        //         {data.map((streamer: Streamer,i: number) => {
        //             return (
        //                 <div className='streamer' key={i} >
        //                     <div className={`profile animate__animated ${leaderBoardEmoji[i] ? 'animate__tada': 'animate__fadeIn' }`}>
        //                         <img src={imgs[streamer.user_id]}
        //                              alt={`${streamer.user_login}'s profile image`}/>
        //
        //                         <h1 className='position'>{leaderBoardEmoji[i] ? leaderBoardEmoji[i] : `${i+1}`}</h1>
        //                     </div>
        //
        //                     <a href={`https://twitch.tv/${streamer.user_login}`} target="_blank"
        //                        rel="noreferrer" className='info'>
        //                         <h1 className='username' title={streamer.title}>{streamer.user_name} </h1>
        //                         <h2>👥️{streamer.viewer_count}</h2>
        //                     </a>
        //                 </div>
        //             )
        //         })}
        //     </div>
        //     <footer className='footer'>Created with ❤️ by&nbsp; <a href="https://valeriovalletta.it" style={{fontWeight: 'bold'}}>Valerio Valletta</a></footer>
        // </div>

    )
}
/*
export async function getServerSideProps({req,res}:GetServerSidePropsContext) {
    // Fetch data from external API
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=180, stale-while-revalidate=300'
    )

    const TIME_PASSED = new Date().getTime() - tokenCache.timestamp.getTime()

    if(!tokenCache.token ||  (TIME_PASSED > EXPIRE_LIMIT))
        tokenCache.token = await getToken();

    let data = await getTopStreamers();
    data.length = 5;

    const idList = new Set<string>();

    data.forEach((streamer:Streamer) => idList.add(streamer.user_id))

    const imgsMap = await getProfileImgByIDS(idList);
    // Pass data to the page via props
    return { props: { data, imgs: Object.fromEntries(imgsMap) } }

}
*/