"use client";

import { useEffect, useRef } from "react";

interface AdvancedMarkerProps {
  position: { lat: number; lng: number };
  map: google.maps.Map | null;
  label: string;
  onClick: () => void;
}

export default function AdvancedMarker({
  position,
  map,
  label,
  onClick,
}: AdvancedMarkerProps) {
  const markerRef = useRef<
    google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null
  >(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
      const fallbackMarker = new google.maps.Marker({
        position: position,
        map: map,
        label: label,
      });

      fallbackMarker.addListener("click", onClick);

      markerRef.current = fallbackMarker;

      return () => {
        if (markerRef.current) {
          (markerRef.current as google.maps.Marker).setMap(null);
          markerRef.current = null;
        }
      };
    }

    const markerContent = document.createElement("div");
    markerContent.className = "advanced-marker";
    markerContent.innerHTML = `
      <div style="
        background: #ea4335;
        border: 2px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        height: 32px;
        width: 32px;
        position: relative;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        <span style="
          color: white;
          font-size: 14px;
          font-weight: bold;
          transform: rotate(45deg);
        ">${label}</span>
      </div>
    `;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: position,
      map: map,
      content: markerContent,
    });

    marker.addListener("click", onClick);
    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        if (markerRef.current instanceof google.maps.marker.AdvancedMarkerElement) {
          markerRef.current.map = null;
        } else {
          (markerRef.current as google.maps.Marker).setMap(null);
        }
        markerRef.current = null;
      }
    };
  }, [map, position, label, onClick]);

  useEffect(() => {
    if (markerRef.current) {
      if (markerRef.current instanceof google.maps.marker.AdvancedMarkerElement) {
        markerRef.current.position = position;
      } else {
        (markerRef.current as google.maps.Marker).setPosition(position);
      }
    }
  }, [position]);

  return null;
}
