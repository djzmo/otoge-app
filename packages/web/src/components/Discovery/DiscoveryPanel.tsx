"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
  const { searchKeyword, searchResult, setSearchResult, setGameFilter, isNearbySearch, setIsNearbySearch } =
    useContext(SearchContext);

  const [isLoading, setIsLoading] = useState(false);
  const nearbyTriggeredRef = useRef(false);

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
      const nearbyPromise = new Promise<void>((resolve, reject) => {
        navigator?.geolocation.getCurrentPosition(
          async ({ coords: { latitude: lat, longitude: lng } }) => {
            try {
              const result = await StoreApi.searchByPosition(
                lat,
                lng,
                gameFilter,
              );
              if (setIsNearbySearch) setIsNearbySearch(true);
              if (setSearchResult) {
                setSearchResult(result);
              }
              if (setGameFilter) {
                setGameFilter(gameFilter);
              }
              if (typeof window !== "undefined") {
                if (window.location.pathname !== "/map/nearby") {
                  window.history.replaceState(null, "", "/map/nearby");
                }
              }
              resolve();
            } catch (e) {
              console.error(e);
              reject(e as Error);
            }
          },
          (e) => {
            console.error(e);
            if (e.code === 1) {
              reject(new Error("Please allow geolocation"));
            } else {
              reject(new Error(e.message));
            }
          },
        );
      });

      toast.promise(nearbyPromise, {
        loading: "Searching nearby...",
        success: "Nearby results loaded",
        error: (err) => (err?.message ? err.message : "Failed to load"),
      });

      nearbyPromise.finally(() => setIsLoading(false));
    },
    [setGameFilter, setSearchResult, setIsNearbySearch],
  );

  const performSearchKeyword = useCallback(
    async (keyword: string) => {
      if (keyword.length === 0) {
        return;
      }

      setIsLoading(true);
      try {
        const result = await StoreApi.searchByText(keyword);
        if (setIsNearbySearch) setIsNearbySearch(false);
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
    [setSearchResult, setIsNearbySearch],
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
    if (setIsNearbySearch) setIsNearbySearch(false);
    nearbyTriggeredRef.current = false;
    if (onSearchCanceled) {
      onSearchCanceled();
    }
  }, [onSearchCanceled, setIsNearbySearch]);

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

  // trigger nearby search when visited by URL
  useEffect(() => {
    if (isNearbySearch && !nearbyTriggeredRef.current) {
      nearbyTriggeredRef.current = true;
      performSearchNearby();
    }
  }, [isNearbySearch, performSearchNearby]);

  // persist search/nearby state in the URL without navigating
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname;
    const isStorePath = currentPath.startsWith("/map/store/");

    if (isStorePath) {
      // will not override while a place is selected
      return;
    }

    if (isNearbySearch) {
      if (currentPath !== "/map/nearby") {
        window.history.replaceState(null, "", "/map/nearby");
      }
      return;
    }

    if (searchKeyword && searchKeyword.length > 1) {
      const targetPath = `/map/search/${encodeURIComponent(searchKeyword)}`;
      if (currentPath !== targetPath) {
        window.history.replaceState(null, "", targetPath);
      }
    } else if (currentPath !== "/map") {
      window.history.replaceState(null, "", "/map");
    }
  }, [searchKeyword, isNearbySearch]);

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
