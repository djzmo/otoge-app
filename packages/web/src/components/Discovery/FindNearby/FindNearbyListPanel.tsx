"use client";

import GameEnum from "@/domain/GameEnum";
import GameListItem from "./GameListItem";
import useLockScroll from "@/hooks/useLockScroll";

interface FindNearbyListPanelProps {
  canScroll: boolean;
  games: GameEnum[];
  onClickItem: (game: GameEnum) => void;
  className?: string;
}

export default function FindNearbyListPanel({
  canScroll,
  className,
  games,
  onClickItem,
}: FindNearbyListPanelProps) {
  const { scrollElementRef, lockScroll, lockScrollHandlers } = useLockScroll();
  return (
    <section className={`${className} bg-white flex flex-col`}>
      <h4 className="text-sm text-gray-500 font-medium leading-none py-3 border-b border-gray-200 flex-none">
        Find Nearby
      </h4>
      <div
        {...lockScrollHandlers}
        className={
          (canScroll && !lockScroll ? "overflow-y-auto" : "overflow-y-hidden") +
          " overflow-x-hidden pb-16 flex-1 bg-white"
        }
        ref={scrollElementRef}
      >
        {games.map((game, index) => {
          return (
            <GameListItem
              game={game}
              onClick={onClickItem}
              key={"findNearbyList-item-" + index}
            />
          );
        })}
      </div>
    </section>
  );
}
