import React, { ReactNode, useEffect, useState } from "react";
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import { SidebarContent } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useSession } from "next-auth/react";
import { useAppContext } from "../context/app";
import { POMODORO_STATUS, POMODORO_TIMER } from "../enums";

// TODO should be on types folder
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: Function;
    Spotify: any;
  }
}

export function Layout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const {
    pomodoroTimer,
    pomodoroStatus,
    spotifyToken,
    spotifyPlayer,
    spotifyDeviceId,
    updateStatus,
    updateTimer,
    setSpotifyPlayer,
    setSpotifyToken,
    setSpotifyDeviceId,
  } = useAppContext();

  // TODO check to stop the music globally

  useEffect(() => {
    if (pomodoroTimer <= 0) {
      updateStatus(POMODORO_STATUS.STOPPED);
      updateTimer(POMODORO_TIMER.POMODORO);
      return;
    }

    if (pomodoroStatus === POMODORO_STATUS.RUNNING && pomodoroTimer >= 1) {
      const intervalId = setInterval(() => {
        updateTimer(pomodoroTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [pomodoroStatus, pomodoroTimer, spotifyPlayer, updateStatus, updateTimer]);

  useEffect(() => {
    async function getToken() {
      const response = await fetch("/api/spotify");
      const json = await response.json();
      setSpotifyToken(json.access_token);
    }

    getToken();
  }, [setSpotifyToken]);

  useEffect(() => {
    async function setTransferPlayer() {
      if (spotifyDeviceId) {
        await fetch("/api/player-transfer", {
          method: "POST",
          body: JSON.stringify({
            deviceId: spotifyDeviceId,
          }),
        });
      }
    }
    setTransferPlayer();
  }, [spotifyDeviceId]);

  useEffect(() => {
    if (spotifyToken) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb) => {
            cb(spotifyToken);
          },
          volume: 1,
        });

        setSpotifyPlayer(player);

        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          setSpotifyDeviceId(device_id);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("player_state_changed", (state) => {
          if (!state) {
            return;
          }

          player.getCurrentState().then((state) => {
            // !state ? setActive(false) : setActive(true);
          });
        });
        player.connect();
      };
    }
  }, [setSpotifyDeviceId, setSpotifyPlayer, spotifyToken]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} user={session?.user} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}
