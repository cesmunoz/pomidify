import { playerRepeat } from "../../lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    const { body } = req;
    const { deviceId, value } = JSON.parse(body);
    const { accessToken } = await getSession({ req });
    await playerRepeat(accessToken, deviceId, value);

    return res.status(200).json();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default handler;
