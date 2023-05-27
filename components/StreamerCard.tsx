import Streamer from "../interfaces/Streamer";
import {GetServerSidePropsContext} from "next";
import {DateTime} from "ts-luxon";
import {useEffect, useState} from "react";
import Head from "next/head";
import "animate.css"
import {useRouter} from "next/router";
import { leaderBoardEmoji } from "../lib/utils";

export default function StreamerCard({streamer,index, imgs, timePassed}:any) {
const getTimePassed = (streamer:Streamer) => {
        const endDate = DateTime.now()
        const startedAtMillis = new Date(streamer.started_at).getTime()
        return endDate.diff(DateTime.fromMillis(startedAtMillis),['hours'])
            .toHuman({unitDisplay:'short'})
    }
        return (
                            <div className='streamer' key={index} >
                                <div className={`profile animate__animated ${leaderBoardEmoji[index] ? 'animate__tada': 'animate__fadeIn' }`}>
                                    <img src={imgs[streamer.user_id]}
                                            alt={`${streamer.user_login}'s profile image`}/>

                                    <h1 className='position'>{leaderBoardEmoji[index] ? leaderBoardEmoji[index] : `${index+1}`}</h1>
                                </div>

                                <a href={`https://twitch.tv/${streamer.user_login}`} target="_blank"
                                    rel="noreferrer" className='info'>
                                    <h1 className='username' title={streamer.title}>{streamer.user_name} </h1>
                                    <h2>👥️{streamer.viewer_count}</h2>
                                    <p>{timePassed.get(streamer.user_id)}</p>
                                </a>
                            </div>
                
        )
    }

   


