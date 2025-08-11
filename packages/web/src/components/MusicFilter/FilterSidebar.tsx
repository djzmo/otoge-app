"use client";

import Header from "@/components/Header";
import FilterContainer from "./FilterContainer";

export default function FilterSidebar() {
  return (
    <aside className="hidden lg:block w-96 flex-shrink-0">
      <div className="sticky top-0 h-[100vh] bg-white border-e border-gray-200 pt-7 pb-10">
        <Header />
        <div className="px-1">
          <FilterContainer canScroll={true} sheetMode={false} />
        </div>
      </div>
    </aside>
  );
}


