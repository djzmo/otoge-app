"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import StoreApi from "@/api/StoreApi";
import SearchBarPanel from "@/components/Discovery/SearchBar/SearchBarPanel";
import SearchResultListPanel from "@/components/Discovery/SearchResult/SearchResultListPanel";
import FindNearbyListPanel from "@/components/Discovery/FindNearby/FindNearbyListPanel";
import Footer from "@/components/Footer";
import SearchContext from "@/contexts/SearchContext";
import GameEnum from "@/domain/GameEnum";

interface DiscoveryPanelProps {
  canScroll: boolean;
  onSearchCanceled?: () => void;
  onSearchFocus?: () => void;
  sheetMode: boolean;
}

export default function DiscoveryPanel({
  canScroll,
  onSearchCanceled,
  onSearchFocus,
  sheetMode,
}: DiscoveryPanelProps) {
  const { searchKeyword, searchResult, setSearchResult, setGameFilter } =
    useContext(SearchContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isNearbySearch, setIsNearbySearch] = useState(false);

  const recommendedGames = [
    GameEnum.BEATMANIA_IIDX,
    GameEnum.CHUNITHM_NEW,
    GameEnum.DANCEDANCEREVOLUTION,
    GameEnum.DANCERUSH_STARDOM,
    GameEnum.GITADORA_DRUMMANIA,
    GameEnum.GITADORA_GUITARFREAKS,
    GameEnum.HATSUNE_MIKU_PROJECT_DIVA_ARCADE,
    GameEnum.MAIMAI_DX,
    GameEnum.ONGEKI,
    GameEnum.POLARIS_CHORD,
    GameEnum.POP_N_MUSIC,
  ];

  const performSearchNearby = useCallback(
    (gameFilter?: GameEnum) => {
      setIsLoading(true);
      navigator?.geolocation.getCurrentPosition(
        async ({ coords: { latitude: lat, longitude: lng } }) => {
          try {
            const result = await StoreApi.searchByPosition(
              lat,
              lng,
              gameFilter,
            );
            setIsNearbySearch(true);
            if (setSearchResult) {
              setSearchResult(result);
            }
            if (setGameFilter) {
              setGameFilter(gameFilter);
            }
          } catch (e) {
            toast.error("Failed to load");
            console.error(e);
          } finally {
            setIsLoading(false);
          }
        },
        (e) => {
          if (e.code === 1) {
            toast.error("Please allow geolocation");
          } else {
            toast.error(e.message);
          }
          console.error(e);
          setIsLoading(false);
        },
      );
    },
    [setGameFilter, setSearchResult],
  );

  const performSearchKeyword = useCallback(
    async (keyword: string) => {
      if (keyword.length === 0) {
        return;
      }

      setIsLoading(true);
      try {
        const result = await StoreApi.searchByText(keyword);
        setIsNearbySearch(false);
        if (setSearchResult) {
          setSearchResult(result);
        }
      } catch (e) {
        toast.error("Failed to load");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [setSearchResult],
  );

  const onClickNearbyGameItem = useCallback(
    (game: GameEnum) => {
      performSearchNearby(game);
      if (onSearchCanceled) {
        onSearchCanceled();
      }
    },
    [onSearchCanceled, performSearchNearby],
  );

  const onSearchBarBlur = useCallback(() => {
    if (onSearchCanceled) {
      onSearchCanceled();
    }
  }, [onSearchCanceled]);

  const onSearchBarCancel = useCallback(() => {
    setIsNearbySearch(false);
    if (onSearchCanceled) {
      onSearchCanceled();
    }
  }, [onSearchCanceled]);

  const onSearchBarFocus = useCallback(() => {
    if (onSearchFocus) {
      onSearchFocus();
    }
  }, [onSearchFocus]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      await performSearchKeyword(searchKeyword);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword, performSearchKeyword]);

  const onSearchBarSearchNearby = useCallback(async () => {
    performSearchNearby();
  }, [performSearchNearby]);

  return (
    <div className="flex flex-col h-full bg-white rounded-t-[10px]">
      <SearchBarPanel
        isLoading={isLoading}
        isNearbySearch={isNearbySearch}
        onBlur={onSearchBarBlur}
        onCancel={onSearchBarCancel}
        onFocus={onSearchBarFocus}
        onSearchNearby={onSearchBarSearchNearby}
        className="flex flex-none px-4 mb-4"
      />

      {(isNearbySearch ||
        searchKeyword.length > 1 ||
        searchResult.length > 0) && (
        <SearchResultListPanel
          canScroll={canScroll}
          isNearbySearch={isNearbySearch}
          wrapAvailableGames={sheetMode}
          className="grow h-0 px-4"
        />
      )}

      {!isNearbySearch &&
        searchKeyword.length <= 1 &&
        searchResult.length === 0 && (
          <FindNearbyListPanel
            canScroll={canScroll}
            games={recommendedGames}
            onClickItem={onClickNearbyGameItem}
            className="grow h-0 px-4"
          />
        )}
      <Footer sheetMode={sheetMode} className="flex-none mt-4 lg:mb-4" />
    </div>
  );
}
