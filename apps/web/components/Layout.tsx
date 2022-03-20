import React, { ReactNode, useEffect } from "react";
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

export function Layout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const { pomodoroTimer, pomodoroStatus, updateStatus, updateTimer } =
    useAppContext();

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
  }, [pomodoroStatus, pomodoroTimer, updateStatus, updateTimer]);

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
