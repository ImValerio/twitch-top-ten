import {EXPIRE_LIMIT, getToken, tokenCache} from "./api/tokenCache";
import {getTopTen} from "./api/top10";
import Streamer from "../interfaces/Streamer";
import {GetServerSidePropsContext} from "next";
import {DateTime} from "ts-luxon";
import {useEffect, useState} from "react";
import Image from "next/image";
import Head from "next/head";
import "animate.css"

export default function Home({data, imgs}:any) {
    const [timePassed,setTimePassed] = useState(new Map());
    const leaderBoardEmoji = [
        '🥇', '🥈', '🥉'
    ]
    useEffect(()=>{
           calculateAndSetTime();
           const interval = setInterval(calculateAndSetTime, 1000);
           return () => clearInterval(interval);

           },[]
    )

    const calculateAndSetTime = ()=>{
        const newMap = new Map();
        data.forEach((streamer:Streamer)=> {
            newMap.set(streamer.user_id,getTimePassed(streamer))
        })

        setTimePassed(newMap)
    }
    const getTimePassed = (streamer:Streamer) => {
        const endDate = DateTime.now()
        const startedAtMillis = new Date(streamer.started_at).getTime()
        return endDate.diff(DateTime.fromMillis(startedAtMillis),['hours'])
            .toHuman({unitDisplay:'short'})
    }


  return (
      <div className='main-container'>
          <Head>
              <title>Twitch Top 10</title>
              <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
          <h1 className='title'>TOP 10</h1>
          <div className='container'>
              {data.map((streamer: Streamer,i: number) => {
                  return (
                      <div className='streamer' key={i} >
                          <div className={`profile animate__animated ${leaderBoardEmoji[i] ? 'animate__tada': 'animate__fadeIn' }`}>
                              <img src={imgs[streamer.user_id]}
                                     alt={`${streamer.user_login}'s profile image`}/>

                              <h1 className='position'>{leaderBoardEmoji[i] ? leaderBoardEmoji[i] : `${i+1}`}</h1>
                          </div>

                          <a href={`https://twitch.tv/${streamer.user_login}`} target="_blank"
                             rel="noreferrer" className='info'>
                              <h1 className='username' title={streamer.user_name}>{streamer.user_name} </h1>
                              <h2>👥️{streamer.viewer_count}</h2>
                              <p>{timePassed.get(streamer.user_id)}</p>
                          </a>
                      </div>
                  )
              })}
          </div>
      </div>

  )
}

export async function getServerSideProps({req,res}:GetServerSidePropsContext) {
    // Fetch data from external API
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=180, stale-while-revalidate=300'
    )

    const TIME_PASSED = new Date().getTime() - tokenCache.timestamp.getTime()

    if(!tokenCache.token ||  (TIME_PASSED > EXPIRE_LIMIT))
        tokenCache.token = await getToken();

   let {data} = await getTopTen();
    data.length = 10;

    const idList = new Set<string>();

    data.forEach((streamer:Streamer) => idList.add(streamer.user_id))

    const imgsMap = await getProfileImgByIDS(idList);
    // Pass data to the page via props
    return { props: { data, imgs: Object.fromEntries(imgsMap) } }

}


const getProfileImgByIDS = async (ids: Set<string>) => {
    let URL = 'https://api.twitch.tv/helix/users?';
    Array.from(ids).forEach((id, i: number) => {
        i == 0 ? URL += `id=${id}` : URL += `&id=${id}`;
    })
    const res = await fetch(URL,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${tokenCache.token}`,
            "Client-id": `${process.env.CLIENT_ID}`
        }
    })

    const { data } =  await res.json()
    const profileImgMap = new Map() ;

    data.forEach((e:any) => profileImgMap.set(e.id, e.profile_image_url))

    return profileImgMap;
}