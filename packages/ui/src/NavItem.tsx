import type { ReactNode } from "react";
import type { IconType } from "react-icons";

type NavItemProps = {
  Icon?: IconType;
  children: ReactNode;
};

export const NavItem = ({ Icon, children }: NavItemProps) => (
  <div className="flex items-center gap-4">
    {Icon && (
      <Icon className="mr-2 text-xl text-gray-500 group-hover:text-pink-600" />
    )}
    {children}
  </div>
);
