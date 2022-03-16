import {
  FlexProps,
  Flex,
  useColorModeValue,
  IconButton,
  HStack,
  Menu,
  MenuButton,
  Avatar,
  VStack,
  Box,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Icon,
} from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";
import { FiMenu, FiBell, FiChevronDown, FiUser } from "react-icons/fi";

type UserProps = {
  email: string;
  image: string;
  name: string;
};

interface MobileProps extends FlexProps {
  user?: UserProps;
  onOpen: () => void;
}

export const MobileNav = ({ user, onOpen, ...rest }: MobileProps) => {

  const handleLogin = () => {
    return user ? signOut() : signIn();
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Pomidify
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                {user ? (
                  <Avatar size={"sm"} src={user.image} />
                ) : (
                  <Icon
                    mr="4"
                    fontSize="16"
                    _groupHover={{
                      color: "white",
                    }}
                    as={FiUser}
                  />
                )}
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user ? user.name : "Welcome!"}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {user ? user.email : "User not logged in"}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogin}>
                {user ? "Sign out" : "Sign in"}
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
