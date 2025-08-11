"use client";

import Header from "@/components/Header";
import DiscoveryPanel from "./DiscoveryPanel";

export default function DiscoverySidebar() {
  return (
    <div className="hidden fixed top-0 left-0 lg:left-20 bottom-0 w-96 bg-white border-e border-gray-200 pt-7 pb-10 lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 z-40">
      <Header />
      <DiscoveryPanel canScroll={true} sheetMode={false} />
    </div>
  );
}
