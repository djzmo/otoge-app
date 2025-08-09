"use client";

import Header from "@/components/Header";
import DiscoveryPanel from "./DiscoveryPanel";

export default function DiscoverySidebar() {
  return (
    <div className="hidden fixed top-0 start-0 bottom-0 w-96 bg-white border-e border-gray-200 pt-7 pb-10 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0">
      <Header />
      <DiscoveryPanel canScroll={true} sheetMode={false} />
    </div>
  );
}
