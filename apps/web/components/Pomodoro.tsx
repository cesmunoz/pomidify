import {
  Box,
  VStack,
  StackDivider,
  Stack,
  Icon,
  Text,
  // Button,
} from "@chakra-ui/react";
import { FiPause, FiPlay, FiStopCircle } from "react-icons/fi";
import { useAppContext } from "../context/app";
import { POMODORO_TIMER, POMODORO_STATUS } from "../enums";
import { format } from "../utils";
import { Button } from "ui";

export const Pomodoro = () => {
  const {
    pomodoroTimer,
    pomodoroStatus,
    pomodoroTimerSelected,
    spotifyDeviceId,
    spotifySelectedPlaylist,
    updateStatus,
    updateSelectedTimer,
    updateTimer,
    spotifyPlayer,
  } = useAppContext();

  const handlePlayer = async (type: POMODORO_STATUS) => {
    if (type === POMODORO_STATUS.RUNNING) {
      //spotifyPlayer.resume();
      await fetch("/api/player-toggle", {
        method: "POST",
        body: JSON.stringify({
          status: type,
          deviceId: spotifyDeviceId,
          uri: spotifySelectedPlaylist.uri,
        }),
      });
      return;
    }

    spotifyPlayer.pause();
  };

  function handleTimer(timer) {
    updateTimer(timer);
    updateSelectedTimer(timer);
  }

  function handleStatus(type: POMODORO_STATUS) {
    updateStatus(type);
    handlePlayer(type);

    if (type === POMODORO_STATUS.STOPPED) {
      updateTimer(POMODORO_TIMER.POMODORO);
    }
  }

  return (
    <div className="flex flex-col">
      <Stack spacing={4} direction="row" align="center">
        <Button
          colorScheme="pink"
          size="sm"
          onClick={() => handleTimer(POMODORO_TIMER.POMODORO)}
          variant={
            pomodoroTimerSelected !== POMODORO_TIMER.POMODORO ? "ghost" : null
          }
        >
          Pomodoro
        </Button>
        <Button
          colorScheme="pink"
          size="sm"
          onClick={() => handleTimer(POMODORO_TIMER.SHORT_BREAK)}
          variant={
            pomodoroTimerSelected !== POMODORO_TIMER.SHORT_BREAK
              ? "ghost"
              : null
          }
        >
          Short Break
        </Button>
        <Button
          colorScheme="pink"
          size="sm"
          onClick={() => handleTimer(POMODORO_TIMER.LONG_BREAK)}
          variant={
            pomodoroTimerSelected !== POMODORO_TIMER.LONG_BREAK ? "ghost" : null
          }
        >
          Long Break
        </Button>
      </Stack>
      <Stack spacing={4} direction="row" align="center">
        <Text
          fontSize="6xl"
          fontFamily="monospace"
          fontWeight="bold"
          color="pink.600"
        >
          {format(pomodoroTimer)}
        </Text>
      </Stack>
      <Stack spacing={4} direction="row" align="center">
        <Icon
          as={pomodoroStatus === POMODORO_STATUS.RUNNING ? FiPause : FiPlay}
          color="pink.600"
          onClick={() =>
            handleStatus(
              pomodoroStatus === POMODORO_STATUS.RUNNING
                ? POMODORO_STATUS.PAUSED
                : POMODORO_STATUS.RUNNING
            )
          }
        />
        <Icon
          as={FiStopCircle}
          color="pink.600"
          onClick={() => handleStatus(POMODORO_STATUS.STOPPED)}
        />
      </Stack>
    </div>
  );
};
