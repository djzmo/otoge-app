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

const GOOGLE_MAPS_LIBRARIES: "marker"[] = ["marker"];

export default function MapApp() {

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isInFullscreen, setIsInFullscreen] = useState(false);

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
  }, [fitBoundsToResult, searchResult]);

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
          <DiscoverySheet open={selectedStore == null} />
          <DiscoverySidebar />
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
          <StoreSheet onClose={onCloseStoreDetails} />
          <StoreSidebar onClose={onCloseStoreDetails} />
        </ErrorBoundary>

        <Toaster />
      </div>
    </SearchContext.Provider>
  );
}
