// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    token: string
}
export let tokenCache = {
    token: '',
    timestamp: new Date(),
};

export const EXPIRE_LIMIT = 4715300;
export async function getToken (){

    const formData = new URLSearchParams();

    // @ts-ignore
    formData.append("client_secret", process.env.CLIENT_SECRET);
    // @ts-ignore
    formData.append("client_id", process.env.CLIENT_ID);
    formData.append("grant_type", "client_credentials");
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
        body: formData,
    })

    const {access_token} = await response.json();
    return access_token;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    const TIME_PASSED = new Date().getTime() - tokenCache.timestamp.getTime()
    if(tokenCache.token && (TIME_PASSED < EXPIRE_LIMIT))
        return res.status(200).json({token: tokenCache.token})
    const access_token = await getToken();
    tokenCache.token = access_token;
    res.status(200).json({token: access_token})
}
