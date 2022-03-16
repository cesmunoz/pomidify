import { getUsersPlaylists } from "../../lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    const { accessToken } = await getSession({ req });
    const response = await getUsersPlaylists(accessToken);
    const result = await response.json();
    console.log('Result', result);
    const { items } = result;

    return res.status(200).json({ items });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default handler;
