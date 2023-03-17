import { Flex, FlexProps, Icon } from "@chakra-ui/react";
import { ReactText } from "react";
import { IconType } from "react-icons";
import Link from "next/link";

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  href: string;
}
export const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  return (
    <Link href={href}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
