import { playerState } from "../../lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    const { body } = req;
    const { type, deviceId, value } = JSON.parse(body);
    const { accessToken } = await getSession({ req });
    await playerState(accessToken, deviceId, type, value);
   
    return res.status(200).json();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default handler;
