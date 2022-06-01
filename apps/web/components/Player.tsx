import {
  Box,
  VStack,
  HStack,
  Icon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Spacer,
  List,
  ListItem,
  ListIcon,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  FiShuffle,
  FiSkipBack,
  FiSkipForward,
  FiRepeat,
  FiMusic,
} from "react-icons/fi";
import { PLAYER_REPEAT_STATE } from "../enums";
import { formatProgressSong } from "../utils";
import { useAppContext } from "../context/app";

export const Player = () => {
  const {
    spotifyDeviceId,
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
    <Box height="300px">
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
                    playerRepeat !== PLAYER_REPEAT_STATE.OFF ? "pink.600" : null
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
              isReadOnly
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
  );
};
