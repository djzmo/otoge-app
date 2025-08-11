"use client";

import { usePathname, useRouter } from "next/navigation";
import { MapPin, Music, Bookmark } from "lucide-react";
import type { ComponentType } from "react";

type IconComponentType = ComponentType<{ size?: number; className?: string }>;

type SidebarTab = {
  id: string;
  name: string;
  icon: IconComponentType;
  path: string;
};

const tabs: SidebarTab[] = [
  {
    id: "map",
    name: "Map",
    icon: MapPin,
    path: "/map",
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    path: "/music",
  },
  {
    id: "bookmarks",
    name: "Bookmarks",
    icon: Bookmark,
    path: "/bookmarks",
  },
];

export default function MenuSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-gray-200 z-30">
      <nav className="flex flex-col w-full py-4" aria-label="Primary">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = pathname.startsWith(tab.path);

          return (
            <button
              key={tab.id}
              onClick={() => handleNavigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-4 text-center transition-colors w-full ${
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <IconComponent size={20} className="mb-1" />
              <span className="text-xs font-medium">{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}


