"use client";

import { useContext, useMemo } from "react";
import SearchContext from "@/contexts/SearchContext";
import Store from "@/domain/Store";
import StoreIcon from "./StoreIcon";
import useWindowSize from "@/hooks/useWindowSize";

interface StoreListItemProps {
  store: Store;
  onClick: (store: Store) => void;
  index?: number;
}

export default function StoreListItem({
  store,
  onClick,
  index,
}: StoreListItemProps) {
  const { textMode } = useContext(SearchContext);
  const { width } = useWindowSize();

  // Memoize the max length calculation to avoid recalculating on every render
  const maxTextLength = useMemo(() => {
    return Math.floor(width / 16);
  }, [width]);

  const cropText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  return (
    <button
      type="button"
      onClick={() => onClick(store)}
      className="inline-flex items-center w-full border-b border-gray-300 gap-x-2 py-3 px-3 mx-1 text-sm text-left font-medium focus:bg-blue-100 bg-white hover:bg-gray-50"
    >
      <StoreIcon brand={store.brand} />
      <div className="flex flex-col">
        <h2 className="text-lg text-blue-500 inline-flex items-center gap-x-2">
          {index != null && (
            <span className="inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium bg-rose-500 text-white">
              {index + 1}
            </span>
          )}
          {cropText(
            textMode === "alternate" &&
              store.alternateStoreName != null &&
              store.alternateStoreName.length > 0
              ? store.alternateStoreName
              : store.storeName,
            maxTextLength,
          )}
        </h2>
      </div>
    </button>
  );
}
