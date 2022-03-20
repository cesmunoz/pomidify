import { POMODORO_STATUS } from "../enums";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const PLAY_ENDPOINT = `https://api.spotify.com/v1/me/player/play`;
const PAUSED_ENDPOINT = `https://api.spotify.com/v1/me/player/pause`;

const getAccessToken = async (refresh_token) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

export const getTopTracks = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);

  return fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getUsersPlaylists = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const player = async (refresh_token, status: POMODORO_STATUS) => {
  const { access_token } = await getAccessToken(refresh_token);
  console.log('ACCESS TOKEN', access_token);
  const url =
    status === POMODORO_STATUS.RUNNING ? PLAY_ENDPOINT : PAUSED_ENDPOINT;

  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
