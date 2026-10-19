/* eslint-disable @next/next/no-img-element */
import {
  FiRepeat,
  FiShuffle,
  FiSkipBack,
  FiSkipForward,
} from "react-icons/fi";
import { PLAYER_REPEAT_STATE } from "../enums";
import { formatProgressSong } from "../utils";
import { useAppContext } from "../context/app";
import { Slider, Typography } from "ui";
import cx from "classnames";

export const Player = () => {
  const {
    spotifyDeviceId,
    spotifyPlayer,
    spotifyPlayerState,
    progressSong,
    setPlayerShuffle,
    playerShuffle,
    setPlayerRepeat,
    playerRepeat,
  } = useAppContext();

  const progressPercentage = spotifyPlayerState
    ? (progressSong * 100) / spotifyPlayerState.duration
    : 0;

  const handleSkipBack = () => spotifyPlayer.previousTrack();
  const handleSkipForward = () => spotifyPlayer.nextTrack();

  const handleRepeat = async () => {
    let nextPlayerRepeatValue = PLAYER_REPEAT_STATE.OFF;

    if (playerRepeat === PLAYER_REPEAT_STATE.OFF) {
      nextPlayerRepeatValue = PLAYER_REPEAT_STATE.CONTEXT;
    }

    if (playerRepeat === PLAYER_REPEAT_STATE.CONTEXT) {
      nextPlayerRepeatValue = PLAYER_REPEAT_STATE.TRACK;
    }

    setPlayerRepeat(nextPlayerRepeatValue);
    await fetch("/api/player-repeat", {
      method: "POST",
      body: JSON.stringify({
        deviceId: spotifyDeviceId,
        value: nextPlayerRepeatValue,
      }),
    });
  };

  const handleShuffle = async () => {
    setPlayerShuffle(!playerShuffle);
    await fetch("/api/player-shuffle", {
      method: "POST",
      body: JSON.stringify({
        deviceId: spotifyDeviceId,
        value: !playerShuffle,
      }),
    });
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="flex">
          <div className="mt-3 px-4">
            <img
              className="h-14 w-14 rounded-md"
              src={spotifyPlayerState?.currentTrack?.album?.images[0].url}
              alt={spotifyPlayerState?.currentTrack?.album?.name}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1 pt-2">
            <Typography className="text-sm font-semibold">
              {spotifyPlayerState?.currentTrack?.name}
              SONG
            </Typography>
            <Typography className="text-xs text-gray-500">
              {spotifyPlayerState?.currentTrack?.artists[0].name}
              ARTIST
            </Typography>
            <div className="flex items-center gap-2">
              <FiShuffle
                className={cx({
                  "text-pink-600": playerShuffle,
                })}
                onClick={handleShuffle}
              />
              <FiSkipBack onClick={handleSkipBack} />
              <FiSkipForward onClick={handleSkipForward} />
              <FiRepeat
                className={cx({
                  "text-pink-600": playerRepeat !== PLAYER_REPEAT_STATE.OFF,
                })}
                onClick={handleRepeat}
              />
              {playerRepeat === PLAYER_REPEAT_STATE.TRACK && (
                <Typography intent="primary" className="-ml-2 -mt-2 text-xs">
                  1
                </Typography>
              )}
            </div>
          </div>
        </div>
        <div className="w-full px-5 pb-5">
          <Slider
            aria-label="slider-ex-2"
            value={[Number.isFinite(progressPercentage) ? progressPercentage : 0]}
            max={100}
            className="pointer-events-none"
          />
          <div className="flex">
            <Typography intent="primary" className="text-sm">
              {formatProgressSong(progressSong)}
            </Typography>
            <span className="flex-1" />
            <Typography>
              {spotifyPlayerState &&
                formatProgressSong(
                  spotifyPlayerState.duration - progressSong,
                  true
                )}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
