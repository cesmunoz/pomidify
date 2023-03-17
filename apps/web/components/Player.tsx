/* eslint-disable @next/next/no-img-element */
import {
  Box,
  VStack,
  HStack,
  Icon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Spacer,
  List,
  ListItem,
  ListIcon,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  FiShuffle,
  FiSkipBack,
  FiSkipForward,
  FiRepeat,
  FiMusic,
} from "react-icons/fi";
import { PLAYER_REPEAT_STATE } from "../enums";
import { formatProgressSong } from "../utils";
import { useAppContext } from "../context/app";
import { Typography } from "ui";
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
      <div className="w-full flex flex-col border border-gray-200 rounded-lg shadow-lg bg-white">
        <div className="flex">
          <div className="px-4 mt-3">
            <img
              className="w-14 h-14 rounded-md"
              src={spotifyPlayerState?.currentTrack?.album?.images[0].url}
              alt={spotifyPlayerState?.currentTrack?.album?.name}
            />
          </div>
          <div className="flex flex-col pt-2 flex-1 gap-1">
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
        <div className="w-full pb-5 px-5">
          <Slider
            aria-label="slider-ex-2"
            colorScheme="pink"
            value={progressPercentage}
            isReadOnly
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Flex>
            <Typography intent="primary" className="text-sm">
              {formatProgressSong(progressSong)}
            </Typography>
            <Spacer />
            <Typography>
              {spotifyPlayerState &&
                formatProgressSong(
                  spotifyPlayerState.duration - progressSong,
                  true
                )}
            </Typography>
          </Flex>
        </div>
      </div>
      <div className="w-full flex flex-col mt-2">
        <Typography className="text-lg">Next Songs:</Typography>
        <ul>
          {spotifyPlayerState?.nextTracks.map((nextTrack) => (
            <ListItem key={nextTrack.id}>
              <ListIcon as={FiMusic} color="pink.600" />
              {nextTrack.name} ({nextTrack.artists[0].name})
            </ListItem>
          ))}
        </ul>
      </div>
    </div>
  );
};
