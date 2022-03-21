import { getSession } from "next-auth/react";
import { getAccessToken } from "../../lib/spotify";

const handler = async (req, res) => {
  try {
    const { accessToken: refresh_token } = await getSession({ req });
    const { access_token } = await getAccessToken(refresh_token);
    return res.status(200).json({
      access_token,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default handler;
