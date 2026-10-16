import { Pomodoro } from "../components/Pomodoro";
import { Player } from "../components/Player";

export default function PomodoroPage() {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
      <Pomodoro />
      <Player />
    </div>
  );
}
