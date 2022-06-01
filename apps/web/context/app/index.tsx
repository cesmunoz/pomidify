import { createContext, useContext, useReducer } from "react";
import {
  PLAYER_REPEAT_STATE,
  POMODORO_STATUS,
  POMODORO_TIMER,
} from "../../enums";

enum ACTION_TYPES {
  CHANGE_POMODORO_STATUS = "CHANGE_POMODORO_STATUS",
  POMODORO_TIMER = "POMODORO_TIMER",
  SET_SPOTIFY_PLAYER = "SET_SPOTIFY_PLAYER",
  SET_SPOTIFY_TOKEN = "SET_SPOTIFY_TOKEN",
  SET_SPOTIFY_DEVICE_ID = "SET_SPOTIFY_DEVICE_ID",
  SET_SPOTIFY_PLAYER_STATE = "SET_SPOTIFY_PLAYER_STATE",
  SET_PROGRESS_SONG = "SET_PROGRESS_SONG",
  SET_PLAYER_SHUFFLE = "SET_PLAYER_SHUFFLE",
  SET_PLAYER_REPEAT = "SET_PLAYER_REPEAT",
  POMODORO_TIMER_SELECTED = "POMODORO_TIMER_SELECTED",
  SPOTIFY_SELECTED_PLAYLIST = "SPOTIFY_SELECTED_PLAYLIST",
  SET_ADD_TODO_ITEM = "SET_ADD_TODO_ITEM",
}

type SpotifyPlayerState = {
  duration: number;
  position: number;
  currentTrack: any; // TODO: Define currentTrack Type
  nextTracks: any; // TODO: Define nextTracks type
};

type SpotifyPlaylist = {
  uri: string;
  id: string;
};

type TodoItem = {
  id: string;
  order: number;
  name: string;
  description?: string;
  completed: boolean;
};

type AppContext = {
  pomodoroTimer: number;
  pomodoroTimerSelected: POMODORO_TIMER;
  pomodoroStatus: POMODORO_STATUS;
  spotifyPlayer?: any;
  spotifyToken?: string;
  spotifyDeviceId?: string;
  spotifySelectedPlaylist?: SpotifyPlaylist;
  spotifyPlayerState?: SpotifyPlayerState;
  progressSong: number;
  playerShuffle: boolean;
  playerRepeat: PLAYER_REPEAT_STATE;
  todoList: Array<TodoItem>;
  updateStatus?: Function;
  updateTimer?: Function;
  updateSelectedTimer?: Function;
  setSpotifyPlayer?: Function;
  setSpotifyToken?: Function;
  setSpotifyDeviceId?: Function;
  setSpotifyPlaylist?: Function;
  setPlaylistSelected?: Function;
  updateSpotifyPlayerState?: Function;
  setProgressSong?: Function;
  setPlayerShuffle?: Function;
  setPlayerRepeat?: Function;
  setAddTodoItem?: Function;
};

const initialState: AppContext = {
  pomodoroStatus: POMODORO_STATUS.STOPPED,
  pomodoroTimer: POMODORO_TIMER.POMODORO,
  pomodoroTimerSelected: POMODORO_TIMER.POMODORO,
  progressSong: 0,
  playerShuffle: false,
  playerRepeat: PLAYER_REPEAT_STATE.OFF,
  todoList: [
    {
      id: "1",
      completed: false,
      name: "TASK A",
      order: 0,
      description: "This is a description for Task A"
    },
    {
      id: "2",
      completed: false,
      name: "TASK B",
      order: 1,
      description: "This is a description for Task B"
    }
  ],
};

export const AppContext = createContext<AppContext | null>(null);

function AppReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case ACTION_TYPES.CHANGE_POMODORO_STATUS:
      return {
        ...state,
        pomodoroStatus: payload,
      };
    case ACTION_TYPES.POMODORO_TIMER:
      return {
        ...state,
        pomodoroTimer: payload,
      };
    case ACTION_TYPES.SET_SPOTIFY_PLAYER:
      return {
        ...state,
        spotifyPlayer: payload,
      };
    case ACTION_TYPES.SET_SPOTIFY_TOKEN:
      return {
        ...state,
        spotifyToken: payload,
      };
    case ACTION_TYPES.SET_SPOTIFY_DEVICE_ID:
      return {
        ...state,
        spotifyDeviceId: payload,
      };
    case ACTION_TYPES.SET_SPOTIFY_PLAYER_STATE:
      return {
        ...state,
        spotifyPlayerState: payload,
      };
    case ACTION_TYPES.SET_PROGRESS_SONG:
      return {
        ...state,
        progressSong: payload,
      };
    case ACTION_TYPES.SET_PLAYER_SHUFFLE:
      return {
        ...state,
        playerShuffle: payload,
      };
    case ACTION_TYPES.SET_PLAYER_REPEAT:
      return {
        ...state,
        playerRepeat: payload,
      };
    case ACTION_TYPES.POMODORO_TIMER_SELECTED:
      return {
        ...state,
        pomodoroTimerSelected: payload,
      };
    case ACTION_TYPES.SPOTIFY_SELECTED_PLAYLIST:
      return {
        ...state,
        spotifySelectedPlaylist: payload,
      };
    case ACTION_TYPES.SET_ADD_TODO_ITEM:
      return {
        ...state,
        todoList: [...state.todoList, payload],
      };
    default:
      throw new Error(`Action ${type} not implemented`);
  }
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be inside a AppProvider");
  }
  return context;
}

export function AppProvider(props) {
  const updateStatus = (type: POMODORO_STATUS) =>
    dispatch({
      type: ACTION_TYPES.CHANGE_POMODORO_STATUS,
      payload: type,
    });

  const updateTimer = (timer: number) =>
    dispatch({
      type: ACTION_TYPES.POMODORO_TIMER,
      payload: timer,
    });

  const setSpotifyPlayer = (player: any) =>
    dispatch({
      type: ACTION_TYPES.SET_SPOTIFY_PLAYER,
      payload: player,
    });

  const setSpotifyToken = (token: string) =>
    dispatch({
      type: ACTION_TYPES.SET_SPOTIFY_TOKEN,
      payload: token,
    });

  const setSpotifyDeviceId = (deviceId: string) =>
    dispatch({
      type: ACTION_TYPES.SET_SPOTIFY_DEVICE_ID,
      payload: deviceId,
    });

  const updateSpotifyPlayerState = (payload: SpotifyPlayerState) =>
    dispatch({
      type: ACTION_TYPES.SET_SPOTIFY_PLAYER_STATE,
      payload,
    });

  const setProgressSong = (payload: number) =>
    dispatch({
      type: ACTION_TYPES.SET_PROGRESS_SONG,
      payload,
    });

  const setPlayerShuffle = (payload: boolean) =>
    dispatch({
      type: ACTION_TYPES.SET_PLAYER_SHUFFLE,
      payload,
    });

  const setPlayerRepeat = (payload: boolean) =>
    dispatch({
      type: ACTION_TYPES.SET_PLAYER_REPEAT,
      payload,
    });

  const updateSelectedTimer = (payload: POMODORO_TIMER) =>
    dispatch({
      type: ACTION_TYPES.POMODORO_TIMER_SELECTED,
      payload,
    });

  const setSpotifyPlaylist = (payload: SpotifyPlaylist) =>
    dispatch({
      type: ACTION_TYPES.SPOTIFY_SELECTED_PLAYLIST,
      payload,
    });

  const setAddTodoItem = (payload: TodoItem) =>
    dispatch({
      type: ACTION_TYPES.SET_ADD_TODO_ITEM,
      payload,
    });

  const [state, dispatch] = useReducer(AppReducer, {
    ...initialState,
    updateStatus,
    updateTimer,
    updateSelectedTimer,
    setSpotifyPlayer,
    setSpotifyToken,
    setSpotifyDeviceId,
    updateSpotifyPlayerState,
    setProgressSong,
    setPlayerShuffle,
    setPlayerRepeat,
    setSpotifyPlaylist,
    setAddTodoItem
  });
  return <AppContext.Provider value={state} {...props} />;
}
