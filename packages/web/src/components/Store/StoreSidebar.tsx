"use client";

import { useContext } from "react";
import Header from "@/components/Header";
import StorePanel from "@/components/Store/StorePanel";
import SearchContext from "@/contexts/SearchContext";

interface StoreSidebarProps {
  onClose: () => void;
}

export default function StoreSidebar({ onClose }: StoreSidebarProps) {
  const { selectedStore } = useContext(SearchContext);
  return (
    selectedStore && (
      <div className="hidden fixed top-0 left-0 lg:left-20 bottom-0 w-96 bg-white border-e border-gray-200 pt-7 pb-10 md:block md:translate-x-0 md:right-auto md:bottom-0 z-40">
        <Header />
        <StorePanel onClose={onClose} canScroll={true} />
      </div>
    )
  );
}
