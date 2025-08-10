"use client";

import { useEffect, useRef } from "react";

interface CurrentLocationMarkerProps {
  map: google.maps.Map | null;
  position: { lat: number; lng: number } | null;
}

export default function CurrentLocationMarker({ map, position }: CurrentLocationMarkerProps) {
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map || !position) {
      return;
    }

    if (!markerRef.current) {
      const marker = new google.maps.Marker({
        position,
        map,
        clickable: false,
        zIndex: 9999,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeOpacity: 1,
          strokeWeight: 2,
        },
      });
      markerRef.current = marker;
    } else {
      markerRef.current.setPosition(position);
      if (!markerRef.current.getMap()) {
        markerRef.current.setMap(map);
      }
    }
  }, [map, position]);

  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, []);

  return null;
} 