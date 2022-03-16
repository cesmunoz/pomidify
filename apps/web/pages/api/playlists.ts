import { getUsersPlaylists } from "../../lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    console.log("NEXTAUTH_URL", process.env.NEXTAUTH_URL)
    console.log("VERCEL_URL", process.env.VERCEL_URL)
    console.log('CLIENT ID', process.env.SPOTIFY_CLIENT_ID)
    const { accessToken } = await getSession({ req });
    const response = await getUsersPlaylists(accessToken);
    const { items }  = await response.json();

    return res.status(200).json({ items });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default handler;
