import { createContext, useContext, useReducer } from "react";
import { POMODORO_STATUS, POMODORO_TIMER } from "../../enums";

enum ACTION_TYPES {
  CHANGE_POMODORO_STATUS = "CHANGE_POMODORO_STATUS",
  POMODORO_TIMER = "POMODORO_TIMER"
}

type AppContext = {
  pomodoroTimer: number;
  pomodoroStatus: POMODORO_STATUS,
  updateStatus?: Function,
  updateTimer?: Function,
}

const initialState: AppContext = {
  pomodoroStatus: POMODORO_STATUS.STOPPED,
  pomodoroTimer: POMODORO_TIMER.POMODORO
}

export const AppContext = createContext<AppContext | null>(null);

function AppReducer (state, action) {
  const { type, payload} = action;

  switch(type) {
    case ACTION_TYPES.CHANGE_POMODORO_STATUS:
      return {
        ...state,
        pomodoroStatus: payload
      };
    case ACTION_TYPES.POMODORO_TIMER: 
      return {
        ...state,
        pomodoroTimer: payload
      };
    default: 
      throw new Error('Action not implemented');
  }
}

export function useAppContext() {
  const context = useContext(AppContext);
  if(!context) {
    throw new Error('useAppContext must be inside a AppProvider');
  }
  return context;
}

export function AppProvider (props) {
  const updateStatus = (type: POMODORO_STATUS) => dispatch({
    type: ACTION_TYPES.CHANGE_POMODORO_STATUS,
    payload: type
  });

  const updateTimer = (timer: number) => dispatch({
    type: ACTION_TYPES.POMODORO_TIMER,
    payload: timer
  });

  const [state, dispatch] = useReducer(AppReducer, {
    ...initialState,
    updateStatus,
    updateTimer
  });
  return <AppContext.Provider value={state} {...props} />
}