"use client";

import CabinetInfo from "@/domain/CabinetInfo";
import GameEnum from "@/domain/GameEnum";
import useLockScroll from "@/hooks/useLockScroll";
import GameListItem from "@/components/Discovery/FindNearby/GameListItem";

interface CabinetListPanelProps {
  cabinets: CabinetInfo[];
  canScroll: boolean;
}

export default function CabinetListPanel({
  cabinets,
  canScroll,
}: CabinetListPanelProps) {
  const { scrollElementRef, lockScroll, lockScrollHandlers } = useLockScroll();
  const shouldSkipRender = (game: GameEnum) => {
    // High-end BEMANI cabs should supersede old cabs
    return (
      (game == GameEnum.BEATMANIA_IIDX &&
        cabinets.filter(
          (cab) => cab.game == GameEnum.BEATMANIA_IIDX_LIGHTNING_MODEL,
        ).length > 0) ||
      (game == GameEnum.SOUND_VOLTEX &&
        cabinets.filter(
          (cab) => cab.game == GameEnum.SOUND_VOLTEX_VALKYRIE_MODEL,
        ).length > 0) ||
      (game == GameEnum.DANCEDANCEREVOLUTION &&
        cabinets.filter(
          (cab) =>
            cab.game == GameEnum.DANCEDANCEREVOLUTION_20TH_ANNIVERSARY_MODEL,
        ).length > 0)
    );
  };

  return (
    <section className="grow h-0">
      <h4 className="text-sm text-gray-500 font-medium leading-none py-3 border-b-2">
        Games in this area
      </h4>
      <div
        {...lockScrollHandlers}
        className={
          (canScroll && !lockScroll ? "overflow-y-auto" : "overflow-y-hidden") +
          " overflow-x-hidden h-full pb-16"
        }
        ref={scrollElementRef}
      >
        {cabinets.map((cabinet, index) => {
          return shouldSkipRender(cabinet.game) ? (
            ""
          ) : (
            <GameListItem
              game={cabinet.game}
              key={"cabinetListPanel-item-" + index}
            />
          );
        })}
      </div>
    </section>
  );
}
