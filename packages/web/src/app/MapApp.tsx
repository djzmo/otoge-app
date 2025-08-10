"use client";

import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import DiscoverySheet from "@/components/Discovery/DiscoverySheet";
import DiscoverySidebar from "@/components/Discovery/DiscoverySidebar";
import SearchContext from "@/contexts/SearchContext";
import StoreSheet from "@/components/Store/StoreSheet";
import StoreSidebar from "@/components/Store/StoreSidebar";
import GameEnum from "@/domain/GameEnum";
import Store from "@/domain/Store";
import { filterStoreByGame } from "@/util/GameUtil";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdvancedMarker from "@/components/AdvancedMarker";
import useWindowSize from "@/hooks/useWindowSize";

const GOOGLE_MAPS_LIBRARIES: "marker"[] = ["marker"];

interface MapAppProps {
  initialSearchQuery?: string;
}

export default function MapApp({ initialSearchQuery }: MapAppProps = {}) {

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchResult, setSearchResult] = useState<Store[]>([]);
  const [filteredResult, setFilteredResult] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | undefined>();
  const [textMode, setTextMode] = useState("original");
  const [gameFilter, setGameFilter] = useState<GameEnum>();
  const [searchKeyword, setSearchKeyword] = useState(initialSearchQuery || "");
  const [isInFullscreen, setIsInFullscreen] = useState(false);
  const [lastAutoSelectQuery, setLastAutoSelectQuery] = useState<string | null>(null);
  const [isNearbySearch, setIsNearbySearch] = useState(false);

  const { width } = useWindowSize();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLargeScreen = width >= 1024; // Tailwind's default lg breakpoint

  const onLoad = useCallback((map: google.maps.Map) => {
    map.setCenter({
      lat: 35.6793168,
      lng: 139.761269,
    });
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const fitBoundsToResult = useCallback(
    (result: Store[]) => {
      if (result.length === 0) {
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      for (const store of result) {
        bounds.extend(new google.maps.LatLng(store.lat, store.lng));
      }

      if (map != null) {
        map.fitBounds(bounds);
        map.setZoom((map.getZoom() ?? 14) - 1);
        map.panBy(0, 150);
      }
    },
    [map],
  );

  const onCloseStoreDetails = useCallback(() => {
    setSelectedStore(undefined);
    fitBoundsToResult(searchResult);

    // Restore URL to current shallow state when closing details
    if (typeof window !== "undefined") {
      if (isNearbySearch) {
        if (window.location.pathname !== "/map/nearby") {
          window.history.replaceState(null, "", "/map/nearby");
        }
      } else if (searchKeyword && searchKeyword.length > 1) {
        const target = `/map/search/${encodeURIComponent(searchKeyword)}`;
        if (window.location.pathname !== target) {
          window.history.replaceState(null, "", target);
        }
      } else if (window.location.pathname !== "/map") {
        window.history.replaceState(null, "", "/map");
      }
    }
  }, [fitBoundsToResult, searchResult, isNearbySearch, searchKeyword]);

  const focusSelectedStore = useCallback(() => {
    if (map && selectedStore) {
      map.setCenter({ lat: selectedStore.lat, lng: selectedStore.lng });
      map.setZoom(18);
      map.panBy(0, 150);
    }
  }, [map, selectedStore]);

  useEffect(() => {
    if (selectedStore) {
      focusSelectedStore();
    } else {
      fitBoundsToResult(filteredResult);
    }
  }, [filteredResult, fitBoundsToResult, focusSelectedStore, selectedStore]);

  useEffect(() => {
    if (map) {
      if (isInFullscreen) {
        map.setOptions({
          gestureHandling: "none",
          zoomControl: false,
        });
      } else {
        map.setOptions({
          gestureHandling: "greedy",
          zoomControl: true,
        });
      }
    }
  }, [isInFullscreen, map]);

  useEffect(() => {
    const newFilteredResult = gameFilter
      ? filterStoreByGame(searchResult, gameFilter)
      : searchResult;

    setFilteredResult(newFilteredResult);
    fitBoundsToResult(newFilteredResult);
  }, [fitBoundsToResult, gameFilter, searchResult]);

  // enable nearby mode when landing on /map/nearby
  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    if (path === "/map/nearby" && !isNearbySearch) {
      setIsNearbySearch(true);
    }
  }, [isNearbySearch]);

  // auto-select matching store when loaded with /map/store/:storeName
  useEffect(() => {
    if (!initialSearchQuery || initialSearchQuery.length === 0) return;
    if (lastAutoSelectQuery === initialSearchQuery) return;
    if (searchResult.length === 0) return;

    const normalized = (s: string) => s.trim().toLowerCase();
    const queryNorm = normalized(initialSearchQuery);

    const match = searchResult.find((s) =>
      normalized(s.storeName) === queryNorm ||
      (s.alternateStoreName ? normalized(s.alternateStoreName) === queryNorm : false),
    );

    if (match) {
      setSelectedStore(match);
      setLastAutoSelectQuery(initialSearchQuery);
    }
  }, [initialSearchQuery, searchResult, lastAutoSelectQuery]);


  return (
    <SearchContext.Provider
      value={{
        searchResult,
        setSearchResult,
        selectedStore,
        setSelectedStore,
        textMode,
        setTextMode,
        gameFilter,
        setGameFilter,
        searchKeyword,
        setSearchKeyword,
        isInFullscreen,
        setIsInFullscreen,
        isNearbySearch,
        setIsNearbySearch,
      }}
    >
      <div id="root">
        <ErrorBoundary
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Map Loading Error
                </h2>
                <p className="text-gray-600">
                  Unable to load the map. Please refresh the page.
                </p>
              </div>
            </div>
          }
        >
          {isLoaded && (
            <GoogleMap
              options={{
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeControl: false,
                gestureHandling: "greedy",
                zoomControl: false,
                mapId:
                  process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID", // Required for AdvancedMarkerElement
              }}
              zoom={13}
              mapContainerClassName="min-h-screen"
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {filteredResult.map((store, index) => (
                <AdvancedMarker
                  key={`store-${index}`}
                  position={{
                    lat: store.lat,
                    lng: store.lng,
                  }}
                  map={map}
                  label={(index + 1).toString()}
                  onClick={() => setSelectedStore(store)}
                />
              ))}
            </GoogleMap>
          )}
        </ErrorBoundary>

        <ErrorBoundary
          fallback={
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
              <p className="text-center text-gray-600">
                Search interface unavailable
              </p>
            </div>
          }
        >
          {mounted && (isLargeScreen ? (
            <DiscoverySidebar />
          ) : (
            <DiscoverySheet open={selectedStore == null} />
          ))}
        </ErrorBoundary>

        <ErrorBoundary
          fallback={
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
              <p className="text-center text-gray-600">
                Store details unavailable
              </p>
            </div>
          }
        >
          {isLargeScreen ? (
            <StoreSidebar onClose={onCloseStoreDetails} />
          ) : (
            <StoreSheet onClose={onCloseStoreDetails} />
          )}
        </ErrorBoundary>

        <Toaster />
      </div>
      <div className="h-[60px] md:hidden" />
    </SearchContext.Provider>
  );
}
