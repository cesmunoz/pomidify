import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FiBell, FiChevronDown, FiMenu, FiUser } from "react-icons/fi";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "ui";
import { useAppContext } from "../context/app";
import { UserSession } from "../types/next-auth";
import { format } from "../utils";

interface MobileProps {
  user?: UserSession;
  onOpen: () => void;
}

export const MobileNav = ({ user, onOpen }: MobileProps) => {
  const { pathname } = useRouter();
  const hidePomodoroTimer = pathname === "/pomodoro";
  const { pomodoroTimer } = useAppContext();
  const handleLogin = () => {
    return user ? signOut() : signIn();
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 md:ml-60 md:justify-end">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 md:hidden"
        onClick={onOpen}
        aria-label="open menu"
      >
        <FiMenu />
      </button>

      <span className="font-mono text-2xl font-bold md:hidden">Pomidify</span>

      <div className="flex items-center gap-2 md:gap-6">
        {!hidePomodoroTimer && (
          <span className="font-mono text-2xl font-bold">
            {format(pomodoroTimer)}
          </span>
        )}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md"
          aria-label="open menu"
        >
          <FiBell />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md py-2 outline-none">
            <span className="flex items-center">
              {user?.image ? (
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name ?? ""} />
                  <AvatarFallback>
                    <FiUser />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <FiUser className="text-base" />
              )}
              <span className="ml-2 hidden flex-col items-start md:flex">
                <span className="text-sm">{user ? user.name : "Welcome!"}</span>
                <span className="text-xs text-gray-600">
                  {user ? user.email : "User not logged in"}
                </span>
              </span>
              <span className="ml-1 hidden md:inline-flex">
                <FiChevronDown />
              </span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogin}>
              {user ? "Sign out" : "Sign in"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
