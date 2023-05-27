import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import connectDB from "../lib/dbConnect";
import StreamerModel from "../models/Streamer";
import Head from "next/head";
import { leaderBoardEmoji } from "../lib/utils";
import Graph from "../components/Graph";

export default function Leaderboard({ data }: any) {
    const router = useRouter();

    return (
        <div className="main-container">
            <Head>
                <title>Leaderboard</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <h1 className="title-leaderboard">Leaderboard</h1>
            <div className="container">
                <table className={"table"}>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Username</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(
                            (
                                streamer: {
                                    username: string;
                                    totalPoints: number;
                                },
                                i: number
                            ) => {
                                return (
                                    <tr key={i}>
                                        <td>
                                            {leaderBoardEmoji[i]
                                                ? leaderBoardEmoji[i]
                                                : `${i + 1}`}
                                        </td>
                                        <td>{streamer.username}</td>
                                        <td>
                                            {streamer.totalPoints.toFixed(1)}
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>

            <Graph data={data} />

            <button className="btn-red" onClick={() => router.push("/")}>
                BACK
            </button>
            <footer className="footer">
                Created with ❤️ by&nbsp;{" "}
                <a
                    href="https://valeriovalletta.it"
                    style={{ fontWeight: "bold" }}
                >
                    Valerio Valletta
                </a>
            </footer>
        </div>
    );
}
export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    // Fetch data from external API
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=180, stale-while-revalidate=300"
    );

    let data: any = await getLeaderboard();
    // Pass data to the page via props
    return { props: { data } };
}

const getLeaderboard = async () => {
    await connectDB();

    // @ts-ignore
    return StreamerModel.find()
        .select("-_id")
        .sort("-totalPoints")
        .limit(20)
        .lean();
};
