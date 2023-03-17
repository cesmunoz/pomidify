import { getUsersPlaylists } from "../../lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    const session: any = await getSession({ req });
    const { accessToken } = session;
    const response = await getUsersPlaylists(accessToken);
    const { items }  = await response.json();

    return res.status(200).json({ items });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default handler;

