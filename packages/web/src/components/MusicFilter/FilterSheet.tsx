"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import FilterContainer from "./FilterContainer";

interface FilterSheetProps {
  open: boolean;
}

export default function FilterSheet({ open }: FilterSheetProps) {
  const [snap, setSnap] = useState<number | string | null>("355px");

  useEffect(() => {
    if (open) {
      setSnap("355px");
    }
  }, [open]);

  return (
    <Drawer.Root
      open={open}
      dismissible={false}
      snapPoints={["182px", "355px", 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      shouldScaleBackground={false}
      modal={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 lg:hidden" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 lg:hidden overflow-hidden">
          <Drawer.Title className="sr-only">Filter music</Drawer.Title>
          <div className="flex flex-col h-full bg-white rounded-t-[10px]">
            <div className="p-4 flex-none">
              <div aria-hidden className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300" />
            </div>
            <div className="flex-1 min-h-0 px-1">
              <FilterContainer canScroll={snap === 1} sheetMode={true} />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}


