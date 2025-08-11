"use client";

import { useId } from "react";

type GameOption =
  | "maimai でらっくす"
  | "maimai DX International Version"
  | "CHUNITHM"
  | "CHUNITHM International Version"
  | "オンゲキ";

interface GamePanelProps {
  value: GameOption;
  onChange: (next: GameOption) => void;
  className?: string;
}

const GAME_OPTIONS: GameOption[] = [
  "maimai でらっくす",
  "maimai DX International Version",
  "CHUNITHM",
  "CHUNITHM International Version",
  "オンゲキ",
];

export default function GamePanel({ value, onChange, className }: GamePanelProps) {
  const selectId = useId();

  return (
    <section className={["px-4", className].filter(Boolean).join(" ")}> 
      <div>
        <select
          id={selectId}
          aria-label="Game"
          value={value}
          onChange={(e) => onChange(e.target.value as GameOption)}
          className="block w-full text-base leading-tight py-3 px-3 rounded-md bg-gray-100 border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        >
          {GAME_OPTIONS.map((g) => (
            <option key={g} value={g} className="text-base">
              {g}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}


