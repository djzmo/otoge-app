"use client";

import { useCallback, useMemo, useState } from "react";

interface MaimaiFilterPanelProps {
  canScroll: boolean;
  sheetMode: boolean;
  className?: string;
}

type MusicType = "All" | "DX・でらっくす" | "STD・スタンダード" | "UTAGE・宴会場";

const GENRE_OPTIONS = [
  "All",
  "POPS＆アニメ",
  "maimai",
  "niconico＆ボーカロイド",
] as const;
type GenreOption = (typeof GENRE_OPTIONS)[number];

export default function MaimaiFilterPanel({ canScroll, sheetMode, className }: MaimaiFilterPanelProps) {
  const [songName, setSongName] = useState("");
  const [artist, setArtist] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<GenreOption>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<MusicType>("All");

  const levelOptions = useMemo(() => {
    const levels: string[] = ["All"]; // All first
    for (let i = 1; i <= 6; i += 1) levels.push(String(i));
    // 7..15 with plus variants through 14+
    for (let i = 7; i <= 15; i += 1) {
      if (i <= 14) {
        levels.push(String(i));
        levels.push(`${i}+`);
      } else {
        // 15 has no plus variant per spec
        levels.push(String(i));
      }
    }
    return levels;
  }, []);

  const onSelectGenre = useCallback((genre: GenreOption) => {
    setSelectedGenre(genre);
  }, []);

  const onClearFilters = useCallback(() => {
    setSongName("");
    setArtist("");
    setSelectedGenre("All");
    setSelectedLevel("All");
    setSelectedType("All");
  }, []);

  return (
    <div className={["flex flex-col h-full bg-white rounded-t-[10px]", className].filter(Boolean).join(" ")}> 
      <div className="px-4 pt-2 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
      </div>

      <div className={["px-4", canScroll ? "overflow-y-auto grow min-h-0" : ""].join(" ")}
           style={canScroll ? { WebkitOverflowScrolling: "touch" } : undefined}>
        <div className="space-y-6">
          {/* Song Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Song Name</label>
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="block w-full py-3 px-4 rounded-md bg-gray-100 text-gray-900 border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter song name"
            />
          </div>

          {/* Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Artist</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="block w-full py-3 px-4 rounded-md bg-gray-100 text-gray-900 border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter artist"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((genre) => {
                const isSelected = selectedGenre === genre;
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => onSelectGenre(genre)}
                    className={[
                      "px-3 py-2 rounded-md text-sm border",
                      isSelected
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                    aria-pressed={isSelected}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <div className="grid grid-cols-6 gap-2">
              {levelOptions.map((level) => {
                const isSelected = selectedLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedLevel(level)}
                    className={[
                      "px-3 py-2 rounded-md text-sm border text-center",
                      isSelected
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                    aria-pressed={isSelected}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex flex-wrap gap-2">
              {(["All", "DX・でらっくす", "STD・スタンダード", "UTAGE・宴会場"] as MusicType[]).map((type) => {
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={[
                      "px-3 py-2 rounded-md text-sm border",
                      isSelected
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                    aria-pressed={isSelected}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-4 py-4 mt-4 border-t border-gray-100 bg-white flex-none">
        <button
          type="button"
          onClick={onClearFilters}
          className="w-full inline-flex justify-center items-center px-4 py-3 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Clear filters
        </button>
      </div>

      {sheetMode && <div className="h-2" />}
    </div>
  );
}


