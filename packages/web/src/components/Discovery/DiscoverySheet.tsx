"use client";

import { useContext, useEffect, useState } from "react";
import { Drawer } from "vaul";
import SearchContext from "@/contexts/SearchContext";
import DiscoveryPanel from "./DiscoveryPanel";

interface DiscoverySheetProps {
  open: boolean;
}

export default function DiscoverySheet({ open }: DiscoverySheetProps) {
  const { setIsInFullscreen } = useContext(SearchContext);
  const [snap, setSnap] = useState<number | string | null>("355px");

  useEffect(() => {
    if (open) {
      setSnap("355px");
    }
  }, [open]);

  useEffect(() => {
    if (setIsInFullscreen) {
      setIsInFullscreen(snap === 1);
    }
  }, [snap, setIsInFullscreen]);

  return (
    <Drawer.Root
      open={open}
      dismissible={false}
      snapPoints={["148px", "355px", 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      shouldScaleBackground={false}
      modal={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 lg:hidden" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 lg:hidden overflow-hidden">
          <Drawer.Title className="sr-only">
            Search and discover arcade locations
          </Drawer.Title>
          <div className="flex flex-col h-full bg-white rounded-t-[10px]">
            <div className="p-4 flex-none">
              <div
                aria-hidden
                className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8"
              />
            </div>
            <div className="flex-1 min-h-0 px-1">
              <DiscoveryPanel canScroll={snap === 1} sheetMode={true} />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
