import { POMODORO_STATUS, PLAYER_REPEAT_STATE } from "../enums";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const PLAY_ENDPOINT = `https://api.spotify.com/v1/me/player/play`;
const PAUSED_ENDPOINT = `https://api.spotify.com/v1/me/player/pause`;
const TRANSFER_PLAYBACK = `https://api.spotify.com/v1/me/player`;
const REPEAT_ENDPOINT = "https://api.spotify.com/v1/me/player/repeat"
const SHUFFLE_ENDPOINT = "https://api.spotify.com/v1/me/player/shuffle"

export const getAccessToken = async (refresh_token) => {
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

export const player = async (
  refresh_token,
  status: POMODORO_STATUS,
  deviceId: string
) => {
  const { access_token } = await getAccessToken(refresh_token);
  const url =
    status === POMODORO_STATUS.RUNNING ? PLAY_ENDPOINT : PAUSED_ENDPOINT;

  const urlPlayer = `${url}?device_id=${deviceId}`;
  return fetch(urlPlayer, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const playerTransfer = async (refresh_token, deviceId: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  return fetch(TRANSFER_PLAYBACK, {
    method: "PUT",
    body: JSON.stringify({
      device_ids: [deviceId],
    }),
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const playerShuffle = async (
  refresh_token,
  deviceId: string,
  value: any
) => {
  const { access_token } = await getAccessToken(refresh_token);
  const url = `${SHUFFLE_ENDPOINT}?state=${value}&device_id=${deviceId}`;

  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const playerRepeat = async(
  refresh_token,
  deviceId: string,
  value: PLAYER_REPEAT_STATE
) => {
  const { access_token } = await getAccessToken(refresh_token);
  const url = `${REPEAT_ENDPOINT}?state=${value}&device_id=${deviceId}`;

  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}



