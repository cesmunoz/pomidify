import {
  Box,
  SimpleGrid,
  StackDivider,
  VStack,
  Button,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiPause, FiPlay, FiStopCircle } from "react-icons/fi";
import { useAppContext } from "../context/app";
import { POMODORO_STATUS, POMODORO_TIMER } from "../enums";
import { format } from "../utils";

export default function Pomodoro() {
  const { pomodoroTimer, updateStatus, updateTimer } =
    useAppContext();

  function handleTimer(timer) {
    updateTimer(timer);
  }

  function handleStatus(type: POMODORO_STATUS) {
    updateStatus(type);

    if (type === POMODORO_STATUS.STOPPED) {
      updateTimer(POMODORO_TIMER.POMODORO);
    }
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
      <Box height="80px"></Box>
    </SimpleGrid>
  );
}
