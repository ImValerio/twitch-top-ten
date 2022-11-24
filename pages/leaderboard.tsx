import {GetServerSidePropsContext} from "next";
import { useRouter } from 'next/router'
import connectDB from "../lib/dbConnect";
import StreamerModel from "../models/Streamer";

export default function Leaderboard({data}:any) {
    const router = useRouter();
    const leaderBoardEmoji = [
        '🥇', '🥈', '🥉'
    ];

    return (
        <div className='main-container'>

            <h1 className='title'>Leaderboard</h1>
            <div className='container'>
                <table style={{width:'100%',textAlign: 'center', fontSize: '1.2em'}}>

                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Username</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                   <tbody>
                    {data.map((streamer:{username:string, totalPoints: number}, i:number)=>{
                        return(
                            <tr key={i}>
                                <td>{leaderBoardEmoji[i] ? leaderBoardEmoji[i] : `${i+1}`}</td>
                                <td>{streamer.username}</td>
                                <td>{streamer.totalPoints}</td>
                            </tr>
                        )
                    })
                    }
                    </tbody>

                </table>

            </div>
                <button className='btn-red' onClick={()=> router.push('/')}>BACK</button>
            <footer className='footer'>Created with ❤️ by&nbsp; <a href="https://valeriovalletta.it" style={{fontWeight: 'bold'}}>Valerio Valletta</a></footer>
        </div>

    )
}
export async function getServerSideProps({req,res}:GetServerSidePropsContext) {
    // Fetch data from external API
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=180, stale-while-revalidate=300'
    )

    let data = await getLeaderboard();
    // Pass data to the page via props
    return { props: { data  } }

}

const getLeaderboard = async ()=> {

    await connectDB();

    return StreamerModel.find().select('-_id').sort('-totalPoints').limit(20).lean();
}