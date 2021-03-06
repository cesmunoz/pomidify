import { minutesToSeconds } from "../utils";

export enum POMODORO_STATUS {
  RUNNING,
  PAUSED,
  STOPPED,
}

export enum POMODORO_TIMER {
  POMODORO = minutesToSeconds(25), //25
  SHORT_BREAK = minutesToSeconds(5), // 5
  LONG_BREAK = minutesToSeconds(15), // 15
}

export enum PLAYER_REPEAT_STATE {
  TRACK = "track",
  CONTEXT = "context",
  OFF = "off",
}
