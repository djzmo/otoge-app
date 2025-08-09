"use client";

import { useCallback, useContext } from "react";
import { Map, X } from "lucide-react";
import CabinetListPanel from "@/components/Store/CabinetListPanel";
import SearchContext from "@/contexts/SearchContext";

interface StorePanelProps {
  canScroll: boolean;
  onClose: () => void;
}

export default function StorePanel({ canScroll, onClose }: StorePanelProps) {
  const { textMode, selectedStore } = useContext(SearchContext);

  const onMapClick = useCallback(() => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${selectedStore?.lat},${selectedStore?.lng}`,
      "_blank",
    );
  }, [selectedStore?.lat, selectedStore?.lng]);

  return (
    <div className="px-4 bg-white rounded-t-[10px] flex flex-col h-full">
      <div className="flex-none">
        <div className="flex gap-1 mb-1">
          <div className="text-black text-xl font-bold mr-auto shrink grid">
            <span>
              {textMode === "original" ||
              selectedStore?.alternateStoreName == null
                ? selectedStore?.storeName
                : selectedStore?.alternateStoreName}
            </span>
          </div>
          <div className="ml-auto text-gray-700 flex items-start gap-x-2">
            <button
              className="rounded-full bg-gray-200 p-2"
              onClick={onMapClick}
            >
              <Map />
            </button>
            <button className="rounded-full bg-gray-200 p-2" onClick={onClose}>
              <X />
            </button>
          </div>
        </div>

        <div className="font-normal text-gray-500 text-sm mb-1">
          {textMode === "original" || selectedStore?.alternateAddress == null
            ? selectedStore?.address
            : selectedStore?.alternateAddress}
        </div>

        {selectedStore?.openingHours && (
          <div className="font-normal text-gray-500 text-sm mb-1">
            Opening Hours: {selectedStore.openingHours}
          </div>
        )}

        {selectedStore?.access && (
          <div className="font-normal text-gray-500 text-sm mb-1">
            Access: {selectedStore.access}
          </div>
        )}
      </div>

      <CabinetListPanel
        cabinets={selectedStore?.cabinets ?? []}
        canScroll={canScroll}
      />
    </div>
  );
}
