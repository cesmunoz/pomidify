import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  FiCompass,
  FiFileText,
  FiHome,
  FiSettings,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import { NavItem } from "ui";
import { Button } from "ui";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, href: "/" },
  { name: "TodoList", icon: FiFileText, href: "/todo" },
  { name: "Pomodoro", icon: FiTrendingUp, href: "/pomodoro" },
  { name: "Spotify", icon: FiCompass, href: "/spotify" },
  { name: "Favourites", icon: FiStar, href: "/favourites" },
  { name: "Settings", icon: FiSettings, href: "/settings" },
];

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Pomidify
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <div className="flex flex-col gap-2 ml-7">
        {LinkItems.map((link) => (
          <Link key={link.name} href={link.href} passHref>
            <NavItem Icon={link.icon}>{link.name}</NavItem>
          </Link>
        ))}
      </div>
    </Box>
  );
};
