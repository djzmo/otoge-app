"use client";

import { ChangeEvent, KeyboardEvent, useCallback, useContext } from "react";
import { Locate, Search } from "lucide-react";
import SearchContext from "@/contexts/SearchContext";

interface SearchBarPanelProps {
  isLoading: boolean;
  isNearbySearch: boolean;
  onBlur: () => void;
  onCancel: () => void;
  onFocus: () => void;
  onSubmit: () => void;
  onSearchNearby: () => void;
  className?: string;
}

export default function SearchBarPanel({
  className,
  isLoading,
  isNearbySearch,
  onBlur,
  onCancel,
  onFocus,
  onSubmit,
  onSearchNearby,
}: SearchBarPanelProps) {
  const {
    searchKeyword,
    searchResult,
    setGameFilter,
    setSearchKeyword,
    setSearchResult,
  } = useContext(SearchContext);

  const onBlurInner = () => {
    if (searchKeyword.length < 2) {
      if (setSearchKeyword) {
        setSearchKeyword("");
      }
      onBlur();
    }
  };
  const onKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (setSearchKeyword) {
      setSearchKeyword(e.target.value);
    }
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
      (e.target as HTMLInputElement).blur();
    }
  };

  const innerOnCancel = useCallback(() => {
    if (setSearchKeyword) {
      setSearchKeyword("");
    }
    if (setGameFilter) {
      setGameFilter(undefined);
    }
    if (setSearchResult) {
      setSearchResult([]);
    }
    onCancel();
  }, [onCancel, setGameFilter, setSearchKeyword, setSearchResult]);

  return (
    <section className={className}>
      <div className="absolute pointer-events-none z-20 pt-3.5 pl-4 text-gray-500">
        <Search size={16} />
      </div>
      <input
        type="text"
        className="inline-flex py-3 px-4 pl-11 block w-full border-gray-200 shadow-sm rounded-md bg-gray-100 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500"
        placeholder="Search location"
        value={searchKeyword}
        readOnly={isLoading}
        onChange={onKeywordChange}
        onBlur={onBlurInner}
        onFocus={onFocus}
        onKeyUp={onKeyUp}
      />
      {searchKeyword.length > 1 ? (
        <button
          type="button"
          className="inline-flex justify-center items-center ml-3 text-blue-700 border-0"
          onClick={innerOnCancel}
        >
          Cancel
        </button>
      ) : isNearbySearch || searchResult.length > 0 ? (
        <button
          type="button"
          className="inline-flex justify-center items-center ml-3 text-blue-700 border-0"
          onClick={innerOnCancel}
        >
          Done
        </button>
      ) : (
        <button
          type="button"
          disabled={isLoading}
          className="inline-flex justify-center items-center ml-3 bg-blue-500 text-white disabled:bg-gray-400 rounded-md px-4 py-3 h-12"
          onClick={onSearchNearby}
        >
          <Locate size={16} />
        </button>
      )}
    </section>
  );
}
