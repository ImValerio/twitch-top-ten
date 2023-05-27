import { EXPIRE_LIMIT, getToken, tokenCache } from "./api/tokenCache";
import { getTopTen } from "./api/top10";
import Streamer from "../interfaces/Streamer";
import { GetServerSidePropsContext } from "next";
import { DateTime } from "ts-luxon";
import { useEffect, useState } from "react";
import Head from "next/head";
import "animate.css";
import { useRouter } from "next/router";
import StreamerCard from "../components/StreamerCard";

export default function Home({ data, imgs }: any) {
    const router = useRouter();
    const [timePassed, setTimePassed] = useState(new Map());
    useEffect(() => {
        calculateAndSetTime();
        const interval = setInterval(calculateAndSetTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const calculateAndSetTime = () => {
        const newMap = new Map();

        data.forEach((streamer: Streamer) => {
            newMap.set(streamer.user_id, getTimePassed(streamer));
        });

        setTimePassed(newMap);
    };
    const getTimePassed = (streamer: Streamer) => {
        const endDate = DateTime.now();
        const startedAtMillis = new Date(streamer.started_at).getTime();
        return endDate
            .diff(DateTime.fromMillis(startedAtMillis), ["hours"])
            .toHuman({ unitDisplay: "short" });
    };

    return (
        <div className="main-container">
            <Head>
                <title>Twitch Top 10</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <h1 className="title">TOP 10</h1>
            <a
                className="float animate__animated animate__fadeInRight"
                onClick={() => router.push("/leaderboard")}
            >
                <img src={"bar-chart.svg"} alt={"svg chart image"} />
            </a>
            <div className="container">
                {data.map((streamer: Streamer, i: number) => {
                    if (i < 6)
                        return (
                            <StreamerCard
                                key={streamer.id}
                                index={i}
                                streamer={streamer}
                                imgs={imgs}
                                timePassed={timePassed}
                            />
                        );

                    return (
                        <div className="streamers-container" key={i}>
                            <h2>
                                {i + 1}. {streamer.user_name}
                            </h2>
                            <h3>️👥{streamer.viewer_count}</h3>
                        </div>
                    );
                })}
            </div>
            <footer className="footer">
                <p>
                    Created with ❤️ by&nbsp;{" "}
                    <a href="https://valeriovalletta.it">Valerio Valletta</a>
                </p>
            </footer>
        </div>
    );
}

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    try {
        // Fetch data from external API
        res.setHeader(
            "Cache-Control",
            "public, s-maxage=180, stale-while-revalidate=300"
        );

        const TIME_PASSED =
            new Date().getTime() - tokenCache.timestamp.getTime();

        if (!tokenCache.token || TIME_PASSED > EXPIRE_LIMIT)
            tokenCache.token = await getToken();

        let data = await getTopTen();

        const idList = new Set<string>();

        data.forEach((streamer: Streamer) => idList.add(streamer.user_id));

        const imgsMap = await getProfileImgByIDS(idList);

        return { props: { data, imgs: Object.fromEntries(imgsMap) } };
    } catch (error) {
        return { props: { data: [], imgs: [] } };
    }
}

export const getProfileImgByIDS = async (ids: Set<string>) => {
    let URL = "https://api.twitch.tv/helix/users?";
    Array.from(ids).forEach((id, i: number) => {
        i == 0 ? (URL += `id=${id}`) : (URL += `&id=${id}`);
    });
    const res = await fetch(URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${tokenCache.token}`,
            "Client-id": `${process.env.CLIENT_ID}`,
        },
    });

    const { data } = await res.json();
    const profileImgMap = new Map();

    data.forEach((e: any) => profileImgMap.set(e.id, e.profile_image_url));

    return profileImgMap;

};

