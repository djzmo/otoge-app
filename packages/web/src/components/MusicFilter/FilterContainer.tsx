"use client";

import { useMemo, useState } from "react";
import GamePanel from "./GamePanel";
import MaimaiFilterPanel from "./MaimaiFilterPanel";
import ChunithmFilterPanel from "./ChunithmFilterPanel";
import OngekiFilterPanel from "./OngekiFilterPanel";

interface FilterContainerProps {
  canScroll: boolean;
  sheetMode: boolean;
}

type GameOption =
  | "maimai でらっくす"
  | "maimai DX International Version"
  | "CHUNITHM"
  | "CHUNITHM International Version"
  | "オンゲキ";

export default function FilterContainer({ canScroll, sheetMode }: FilterContainerProps) {
  const [selectedGame, setSelectedGame] = useState<GameOption>("maimai でらっくす");

  const gameKey = useMemo(() => {
    if (selectedGame === "maimai でらっくす" || selectedGame === "maimai DX International Version") return "maimai";
    if (selectedGame === "CHUNITHM" || selectedGame === "CHUNITHM International Version") return "chunithm";
    return "ongeki";
  }, [selectedGame]);

  return (
    <div className="flex flex-col h-full bg-white rounded-t-[10px]">
      <div className="flex-none">
        <GamePanel className="pt-2 pb-3" value={selectedGame} onChange={setSelectedGame} />
      </div>
      <div className="flex-1 min-h-0">
        {gameKey === "maimai" && (
          <MaimaiFilterPanel canScroll={canScroll} sheetMode={sheetMode} />
        )}
        {gameKey === "chunithm" && (
          <ChunithmFilterPanel canScroll={canScroll} sheetMode={sheetMode} />
        )}
        {gameKey === "ongeki" && (
          <OngekiFilterPanel canScroll={canScroll} sheetMode={sheetMode} />
        )}
      </div>
    </div>
  );
}


