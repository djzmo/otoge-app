"use client";

import { usePathname, useRouter } from "next/navigation";
import { Music, MapPin, Bookmark } from "lucide-react";

export default function BottomTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      id: "music",
      name: "Music",
      icon: Music,
      path: "/music",
    },
    {
      id: "map",
      name: "Map",
      icon: MapPin,
      path: "/map",
    },
    {
      id: "bookmarks",
      name: "Bookmarks",
      icon: Bookmark,
      path: "/bookmarks",
    },
  ];

  const handleTabPress = (path: string) => {
    router.push(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = pathname === tab.path;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab.path)}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center min-h-[60px] transition-colors ${
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <IconComponent size={20} className="mb-1" />
              <span className="text-xs font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}