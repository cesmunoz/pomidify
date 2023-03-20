import { ReactText } from "react";
import { IconType } from "react-icons";

type NavItemProps = {
  Icon?: IconType;
  children: ReactText;
};

export const NavItem = ({ Icon, children, ...rest }: NavItemProps) => (
  <div className="flex items-center gap-4">
    {Icon && (
      <Icon className="mr-2 text-xl text-gray-500 group-hover:text-white" />
    )}
    {children}
  </div>
);
