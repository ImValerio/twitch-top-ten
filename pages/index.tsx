import {EXPIRE_LIMIT, getToken, tokenCache} from "./api/tokenCache";
import {getTopTen} from "./api/top10";
import {Streamer} from "./interfaces/Streamer";
import {GetServerSideProps, GetServerSidePropsContext} from "next";

export default function Home({data, imgs}:any) {
  return (
      <div>
          {data.map((streamer: Streamer,i: number) => {
              return (
                  <div key={i}>
                      <img src={imgs[streamer.user_id]} />
                      <a href={`https://twitch.tv/${streamer.user_login}`} target="_blank" >
                          <h1>{i+1}) {streamer.user_name} - {streamer.viewer_count}</h1>
                      </a>
                  </div>
              )
          })}
      </div>
  )
}

export async function getServerSideProps({req,res}:GetServerSidePropsContext) {
    // Fetch data from external API
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=180, stale-while-revalidate=180'
    )

    const TIME_PASSED = new Date().getTime() - tokenCache.timestamp.getTime()

    if(!tokenCache.token ||  (TIME_PASSED > EXPIRE_LIMIT))
        tokenCache.token = await getToken();

   let {data} = await getTopTen();
    data.length = 10;

    const idList = new Set<string>();

    data.forEach((streamer:Streamer) => idList.add(streamer.user_id))

    const imgsMap = await getProfileImgByIDS(idList);
    console.log(imgsMap)
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