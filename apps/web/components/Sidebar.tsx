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
import { cn, NavItem } from "ui";

interface SidebarProps {
  onClose: () => void;
  className?: string;
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

export const SidebarContent = ({ onClose, className }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "z-40 h-full w-full flex-col border-r border-gray-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-60",
        className
      )}
    >
      <div className="mx-8 flex h-20 items-center justify-between">
        <span className="font-mono text-2xl font-bold">Pomidify</span>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md md:hidden"
          aria-label="Close"
          onClick={onClose}
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ×
          </span>
        </button>
      </div>
      <div className="ml-7 flex flex-col gap-2">
        {LinkItems.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="group rounded-md py-1"
            onClick={onClose}
          >
            <NavItem Icon={link.icon}>{link.name}</NavItem>
          </Link>
        ))}
      </div>
    </aside>
  );
};
