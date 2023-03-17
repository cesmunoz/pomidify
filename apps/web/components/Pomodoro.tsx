import { useAppContext } from "../context/app";
import { POMODORO_TIMER, POMODORO_STATUS } from "../enums";
import { format } from "../utils";
import { Button, Typography } from "ui";
import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";

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
    <div className="flex flex-col justify-center items-center">
      <div className="flex gap-4 items-center">
        <Button
          size="sm"
          onClick={() => handleTimer(POMODORO_TIMER.POMODORO)}
          intent={
            pomodoroTimerSelected !== POMODORO_TIMER.POMODORO && "secondary"
          }
        >
          Pomodoro
        </Button>
        <Button
          size="sm"
          onClick={() => handleTimer(POMODORO_TIMER.SHORT_BREAK)}
          intent={
            pomodoroTimerSelected !== POMODORO_TIMER.SHORT_BREAK && "secondary"
          }
        >
          Short Break
        </Button>
        <Button
          size="sm"
          onClick={() => handleTimer(POMODORO_TIMER.LONG_BREAK)}
          intent={
            pomodoroTimerSelected !== POMODORO_TIMER.LONG_BREAK && "secondary"
          }
        >
          Long Break
        </Button>
      </div>
      <Typography className="font-bold text-6xl" intent="primary">
        {format(pomodoroTimer)}
      </Typography>
      <div className="flex">
        <PlayIcon
          className="h-6 w-6 text-pink-600"
          onClick={() =>
            handleStatus(
              pomodoroStatus === POMODORO_STATUS.RUNNING
                ? POMODORO_STATUS.PAUSED
                : POMODORO_STATUS.RUNNING
            )
          }
        />
        <StopIcon className="h-6 w-6 text-pink-600"  onClick={() => handleStatus(POMODORO_STATUS.STOPPED)} />
      </div>
    </div>
  );
};
