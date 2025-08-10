"use client";

import { createContext, Dispatch, SetStateAction } from "react";
import Store from "@/domain/Store";
import GameEnum from "@/domain/GameEnum";

interface SearchContextValue {
  searchResult: Store[];
  setSearchResult?: Dispatch<SetStateAction<Store[]>>;
  selectedStore?: Store;
  setSelectedStore?: Dispatch<SetStateAction<Store | undefined>>;
  textMode: string;
  setTextMode?: Dispatch<SetStateAction<string>>;
  gameFilter?: GameEnum;
  setGameFilter?: Dispatch<SetStateAction<GameEnum | undefined>>;
  searchKeyword: string;
  setSearchKeyword?: Dispatch<SetStateAction<string>>;
  isInFullscreen: boolean;
  setIsInFullscreen?: Dispatch<SetStateAction<boolean>>;
  isNearbySearch: boolean;
  setIsNearbySearch?: Dispatch<SetStateAction<boolean>>;
}

const SearchContext = createContext<SearchContextValue>({
  searchResult: [],
  textMode: "original",
  searchKeyword: "",
  isInFullscreen: false,
  isNearbySearch: false,
});

export default SearchContext;
