import {
  SimpleGrid,
  Stack,
  Image,
  Box,
  WrapItem,
  Wrap,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/app";

export default function Spotify() {
  const { spotifySelectedPlaylist, setSpotifyPlaylist } = useAppContext();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function getUserPlaylists() {
      const res = await fetch("/api/playlists");
      const { items } = await res.json();
      setPlaylists(items);
    }
    getUserPlaylists();
  }, []);

  const handleClick = (item: any) => {
    console.log('ITEM', item);
    const { id, uri } = item;
    setSpotifyPlaylist({
      id,
      uri,
    });
  };

  return (
    <SimpleGrid>
      <Stack direction="row">
        <Wrap>
          {playlists.map((item) => (
            <WrapItem key={item.id}>
              <Box
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                alignItems="center"
                p="5"
                cursor="pointer"
                bg={spotifySelectedPlaylist?.id === item.id ? "pink.600" : null}
                onClick={() => handleClick(item)}
              >
                <Text
                  fontSize="md"
                  fontFamily="monospace"
                  fontWeight="bold"
                  color={spotifySelectedPlaylist?.id === item.id ? "white" : "black"}
                >
                  {item.name}
                </Text>
                <Image
                  boxSize="200px"
                  w="400"
                  src={item.images[0]?.url}
                  alt={item.name}
                />
                {spotifySelectedPlaylist?.id === item.id && (
                  <Badge m="2" colorScheme="green">
                    SELECTED
                  </Badge>
                )}
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      </Stack>
    </SimpleGrid>
  );
}
