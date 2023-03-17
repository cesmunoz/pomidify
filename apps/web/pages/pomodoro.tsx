import { Box, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { Pomodoro } from "../components/Pomodoro";
import { Player } from "../components/Player";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";

export default function PomodoroPage() {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
      <Pomodoro />
      <Player />
      {/* <Box w="620px" h="32px"> */}
      {/* <VStack align="left"> */}
      {/* <TodoForm /> */}
      {/* <TodoList /> */}
      {/* </VStack> */}
      {/* </Box> */}
    </div>
  );
}
