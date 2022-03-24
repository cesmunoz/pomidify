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
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  ListItem,
  ListIcon,
  List,
  Icon,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import {
  FiMusic,
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
import { format, formatProgressSong } from "../utils";

export default function Pomodoro() {
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

  const handlePlayer = async (type: POMODORO_STATUS) => {
    if (type === POMODORO_STATUS.RUNNING) {
      //spotifyPlayer.resume();
      await fetch("/api/player-toggle", {
        method: "POST",
        body: JSON.stringify({
          status: type,
          deviceId: spotifyDeviceId,
          uri: spotifySelectedPlaylist.uri
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
    <SimpleGrid columns={2} spacing={10}>
      <Box height="80px">
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="stretch"
        >
          <Stack spacing={4} direction="row" align="center">
            <Button
              colorScheme="pink"
              size="sm"
              onClick={() => handleTimer(POMODORO_TIMER.POMODORO)}
              variant={
                pomodoroTimerSelected !== POMODORO_TIMER.POMODORO
                  ? "ghost"
                  : null
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
                pomodoroTimerSelected !== POMODORO_TIMER.LONG_BREAK
                  ? "ghost"
                  : null
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
              size="sm"
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
              size="sm"
              onClick={() => handleStatus(POMODORO_STATUS.STOPPED)}
            />
          </Stack>
        </VStack>
      </Box>
      <Box height="80px">
        <Box w="full" borderWidth="1px" rounded="lg" shadow="lg" bg="white">
          <VStack align="left">
            <HStack>
              <Box p="5">
                <Image
                  borderRadius="md"
                  boxSize="100px"
                  src={spotifyPlayerState?.currentTrack?.album?.images[0].url}
                  alt={spotifyPlayerState?.currentTrack?.album?.name}
                />
              </Box>
              <VStack align="left">
                <Text fontSize="2xl" color="gray.600">
                  {spotifyPlayerState?.currentTrack?.name}
                </Text>
                <Text fontSize="md" color="gray.500" pb="2">
                  {spotifyPlayerState?.currentTrack?.artists[0].name}
                </Text>
                <HStack>
                  <Icon
                    as={FiShuffle}
                    onClick={handleShuffle}
                    color={playerShuffle ? "pink.600" : null}
                  />
                  <FiSkipBack onClick={handleSkipBack} />
                  <FiSkipForward onClick={handleSkipForward} />
                  <Icon
                    as={FiRepeat}
                    onClick={handleRepeat}
                    color={
                      playerRepeat !== PLAYER_REPEAT_STATE.OFF
                        ? "pink.600"
                        : null
                    }
                  />
                  {playerRepeat === PLAYER_REPEAT_STATE.TRACK && (
                    <Text
                      as="sub"
                      color="pink.600"
                      style={{ marginLeft: "0px", marginTop: "-10px" }}
                    >
                      1
                    </Text>
                  )}
                </HStack>
              </VStack>
            </HStack>
            <Box w="full" pb="5" px="5">
              <Slider
                aria-label="slider-ex-2"
                colorScheme="pink"
                value={progressPercentage}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Flex>
                <Text color="pink.600" fontSize="sm">
                  {formatProgressSong(progressSong)}
                </Text>
                <Spacer />
                <Text color="pink.600" fontSize="sm">
                  {spotifyPlayerState &&
                    formatProgressSong(
                      spotifyPlayerState.duration - progressSong,
                      true
                    )}
                </Text>
              </Flex>
            </Box>
          </VStack>
        </Box>
        <Box w="full" p="5">
          <VStack align="left">
            <Text fontSize="2xl">Next Songs:</Text>
            <List>
              {spotifyPlayerState?.nextTracks.map((nextTrack) => (
                <ListItem key={nextTrack.id}>
                  <ListIcon as={FiMusic} color="pink.600" />
                  {nextTrack.name} ({nextTrack.artists[0].name})
                </ListItem>
              ))}
            </List>
          </VStack>
        </Box>
      </Box>
    </SimpleGrid>
  );
}
