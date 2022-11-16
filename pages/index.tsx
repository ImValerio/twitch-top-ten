import {EXPIRE_LIMIT, getToken, tokenCache} from "./api/tokenCache";
import {getTopTen} from "./api/top10";

export default function Home({data}:any) {
  return (
      <div>
          {data.map((streamer:any,i:any) => {
              console.log(streamer)
              return (
                  <div key={i}>
                      <img src={streamer.thumbnail_url} />
                      <a href={`https://twitch.tv/${streamer.user_login}`} target="_blank" >
                          <h1>{i+1}) {streamer.user_name} - {streamer.viewer_count}</h1>
                      </a>
                  </div>
              )
          })}
      </div>
  )
}

export async function getServerSideProps() {
    // Fetch data from external API
    const TIME_PASSED = new Date().getTime() - tokenCache.timestamp.getTime()

    if(!tokenCache.token ||  (TIME_PASSED > EXPIRE_LIMIT))
        tokenCache.token = await getToken();

    const {data} = await getTopTen();
    data.length = 10;
    // Pass data to the page via props
    return { props: { data } }
}