import { playerResumePause } from "../../lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    const { body } = req;
    const { status, deviceId, uri } = JSON.parse(body);
    const { accessToken } = await getSession({ req });
    await playerResumePause(accessToken, status, deviceId, uri);
    return res.status(200).json();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default handler;
