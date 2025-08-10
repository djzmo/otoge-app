"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ALargeSmall, Languages, X } from "lucide-react";
import SearchContext from "@/contexts/SearchContext";
import GameEnum from "@/domain/GameEnum";
import Store from "@/domain/Store";
import {
  filterStoreByGame,
  toGameTitle,
  toShortenedGameTitle,
} from "@/util/GameUtil";
import StoreListItem from "./StoreListItem";
import useLockScroll from "@/hooks/useLockScroll";

interface SearchResultListPanelProps {
  canScroll: boolean;
  wrapAvailableGames: boolean;
  isNearbySearch: boolean;
  className?: string;
}

export default function SearchResultListPanel({
  canScroll,
  className,
  wrapAvailableGames,
  isNearbySearch,
}: SearchResultListPanelProps) {
  const {
    searchResult,
    gameFilter,
    textMode,
    setGameFilter,
    setTextMode,
    setSelectedStore,
  } = useContext(SearchContext);
  const { scrollElementRef, lockScroll, lockScrollHandlers } = useLockScroll();
  const [filteredResult, setFilteredResult] = useState<Store[]>([]);

  const getAvailableGames = useCallback((searchResult: Store[]) => {
    const games = new Set<GameEnum>();
    searchResult.forEach((store) =>
      store.cabinets.forEach((cabinet) => games.add(cabinet.game)),
    );
    return Array.from(games);
  }, []);

  const onToggleTextMode = useCallback(() => {
    if (setTextMode) {
      setTextMode(textMode === "original" ? "alternate" : "original");

      toast.success(
        textMode === "original"
          ? "Showing original text"
          : "Showing transliterated text",
        { position: "bottom-center" },
      );
    }
  }, [setTextMode, textMode]);

  const onSelectGameFilter = useCallback(
    (selectedGame: GameEnum) => {
      const newFilter = selectedGame === gameFilter ? undefined : selectedGame;
      if (setGameFilter) {
        setGameFilter(newFilter);
      }
    },
    [gameFilter, setGameFilter],
  );

  const getTitle = useCallback(
    (isNearbyResult: boolean, gameFilter?: GameEnum) => {
      let title = isNearbyResult ? "Nearby Result" : "Search Result";
      if (gameFilter != null) {
        title += ` with ${toGameTitle(gameFilter)}`;
      }
      return title;
    },
    [],
  );

  const onClickResultItem = useCallback(
    (store: Store) => {
      if (setSelectedStore) {
        setSelectedStore(store);
      }
      if (typeof window !== "undefined") {
        const targetPath = `/map/store/${encodeURIComponent(store.storeName)}`;
        if (window.location.pathname !== targetPath) {
          window.history.replaceState(null, "", targetPath);
        }
      }
    },
    [setSelectedStore],
  );

  useEffect(() => {
    setFilteredResult(
      gameFilter ? filterStoreByGame(searchResult, gameFilter) : searchResult,
    );
  }, [gameFilter, searchResult]);

  return (
    <section className={`${className} bg-white flex flex-col`}>
      {filteredResult.length > 0 && (
        <div className="flex gap-5 mb-3 flex-none">
          <div
            className={
              (wrapAvailableGames ? "flex overflow-x-auto" : "") +
              " text-black gap-x-1 px-1 pt-1 pb-2"
            }
          >
            {getAvailableGames(searchResult).map((game, index) => (
              <button
                type="button"
                key={"availableGames-item-" + index}
                onClick={() => onSelectGameFilter(game)}
                className={
                  (gameFilter === game ? "bg-blue-500 text-white" : "") +
                  " " +
                  (wrapAvailableGames
                    ? "gap-x-2 px-3"
                    : "mr-1 mb-1 px-2 py-1") +
                  " whitespace-nowrap text-sm font-medium rounded-lg border border-gray-200 shadow-sm inline-flex items-center"
                }
              >
                {toShortenedGameTitle(game)}
                {gameFilter === game && <X size={12} />}
              </button>
            ))}
          </div>
          <div className="shrink ml-auto py-1">
            <button
              type="button"
              onClick={onToggleTextMode}
              className={
                (textMode === "original"
                  ? "bg-white text-gray-800"
                  : "bg-blue-500 text-white") +
                " py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 shadow-sm"
              }
            >
              {textMode === "original" && <ALargeSmall />}
              {textMode === "alternate" && <Languages />}
            </button>
          </div>
        </div>
      )}
      <h4 className="text-sm text-gray-500 font-medium leading-none py-3 border-b border-gray-200 flex-none">
        {getTitle(isNearbySearch, gameFilter)}
      </h4>
      <div
        {...lockScrollHandlers}
        ref={scrollElementRef}
        className={
          (canScroll && !lockScroll ? "overflow-y-auto" : "overflow-y-hidden") +
          " overflow-x-hidden flex-1 pb-16"
        }
      >
        {filteredResult.length === 0 && (
          <p className="text-center text-sm text-gray-700 py-10">
            No matching stores found
          </p>
        )}
        {filteredResult.map((store, index) => {
          return (
            <StoreListItem
              key={"searchResultList-item" + index}
              store={store}
              index={index}
              onClick={onClickResultItem}
            />
          );
        })}
      </div>
    </section>
  );
}
