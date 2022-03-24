import { useState } from "react";
import {
  Box,
  SimpleGrid,
  StackDivider,
  VStack,
  Button,
  Stack,
  Text,
  HStack,
  Image,
  Progress,
} from "@chakra-ui/react";
import {
  FiPause,
  FiPlay,
  FiRepeat,
  FiShuffle,
  FiSkipBack,
  FiSkipForward,
  FiStopCircle,
} from "react-icons/fi";
import { useAppContext } from "../context/app";
import { POMODORO_STATUS, POMODORO_TIMER, PLAYER_REPEAT_STATE } from "../enums";
import { format } from "../utils";

export default function Pomodoro() {
  const {
    pomodoroTimer,
    spotifyDeviceId,
    updateStatus,
    updateTimer,
    spotifyPlayer,
    spotifyPlayerState,
    progressSong,
    setPlayerShuffle,
    playerShuffle,
    setPlayerRepeat,
    playerRepeat,
  } = useAppContext();

  const progressPercentage = spotifyPlayerState ? 
    progressSong * 100 / spotifyPlayerState.duration : 0;

  const handlePlayer = async (type: POMODORO_STATUS) => {
    if(type === POMODORO_STATUS.RUNNING) {
      spotifyPlayer.resume();
      return;
    }

    spotifyPlayer.pause();
  };

  function handleTimer(timer) {
    updateTimer(timer);
  }

  function handleStatus(type: POMODORO_STATUS) {
    updateStatus(type);
    handlePlayer(type);

    if (type === POMODORO_STATUS.STOPPED) {
      updateTimer(POMODORO_TIMER.POMODORO);
    }
  }

  const handleSkipBack = () => spotifyPlayer.previousTrack();
  const handleSkipForward = () => spotifyPlayer.nextTrack();

  const handleRepeat = async() => {
    let nextPlayerRepeatValue = PLAYER_REPEAT_STATE.OFF;

    if(playerRepeat === PLAYER_REPEAT_STATE.OFF) {
      nextPlayerRepeatValue = PLAYER_REPEAT_STATE.CONTEXT;
    }

    if(playerRepeat === PLAYER_REPEAT_STATE.CONTEXT) {
      nextPlayerRepeatValue = PLAYER_REPEAT_STATE.TRACK;
    }

    setPlayerRepeat(nextPlayerRepeatValue);
    await fetch("/api/player-repeat", {
      method: "POST",
      body: JSON.stringify({
        deviceId: spotifyDeviceId,
        value: nextPlayerRepeatValue
      }),
    });
  }

  const handleShuffle = async() => {
    setPlayerShuffle(!playerShuffle);
    await fetch("/api/player-shuffle", {
      method: "POST",
      body: JSON.stringify({
        deviceId: spotifyDeviceId,
        value: !playerShuffle,
      }),
    });
  }

  return (
    <SimpleGrid columns={2} spacing={10}>
      <Box height="80px">
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="stretch"
        >
          <Stack spacing={4} direction="row" align="center">
            <Button
              colorScheme="teal"
              size="sm"
              onClick={() => handleTimer(POMODORO_TIMER.POMODORO)}
            >
              Pomodoro
            </Button>
            <Button
              colorScheme="teal"
              size="sm"
              onClick={() => handleTimer(POMODORO_TIMER.SHORT_BREAK)}
            >
              Short Break
            </Button>
            <Button
              colorScheme="teal"
              size="sm"
              onClick={() => handleTimer(POMODORO_TIMER.LONG_BREAK)}
            >
              Long Break
            </Button>
          </Stack>
          <Stack spacing={4} direction="row" align="center">
            <Text fontSize="6xl" fontFamily="monospace" fontWeight="bold">
              {format(pomodoroTimer)}
            </Text>
          </Stack>
          <Stack spacing={4} direction="row" align="center">
            <Button
              colorScheme="teal"
              size="sm"
              onClick={() => handleStatus(POMODORO_STATUS.RUNNING)}
            >
              <FiPlay />
            </Button>
            <Button
              colorScheme="teal"
              size="sm"
              onClick={() => handleStatus(POMODORO_STATUS.PAUSED)}
            >
              <FiPause />
            </Button>
            <Button
              colorScheme="teal"
              size="sm"
              onClick={() => handleStatus(POMODORO_STATUS.STOPPED)}
            >
              <FiStopCircle />
            </Button>
          </Stack>
        </VStack>
      </Box>
      <Box height="80px">
        <Box w="full" borderWidth="1px" rounded="lg" shadow="lg">
          <VStack>
            <HStack>
              <Box>
                <Image
                  src={spotifyPlayerState?.currentTrack?.album?.images[1].url}
                  alt={spotifyPlayerState?.currentTrack?.album?.name}
                />
              </Box>
              <VStack>
                <Text fontSize="2xl" color="gray.600">
                  {spotifyPlayerState?.currentTrack?.name}
                </Text>
                <Text fontSize="md" color="gray.500">
                  {spotifyPlayerState?.currentTrack?.artists[0].name}
                </Text>
                <HStack>
                  <FiShuffle onClick={handleShuffle}/>
                  <FiSkipBack onClick={handleSkipBack}/>
                  <FiSkipForward onClick={handleSkipForward}/>
                  <FiRepeat onClick={handleRepeat}/>
                </HStack>
              </VStack>
            </HStack>
            <Box w="full">
              <Progress value={progressPercentage} hasStripe isAnimated />
            </Box>
          </VStack>
        </Box>
      </Box>
    </SimpleGrid>
  );
}
