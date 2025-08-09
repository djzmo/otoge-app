"use client";

import { useContext, useEffect, useState } from "react";
import { Drawer } from "vaul";
import SearchContext from "@/contexts/SearchContext";
import StorePanel from "@/components/Store/StorePanel";

interface StoreSheetProps {
  onClose: () => void;
}

export default function StoreSheet({ onClose }: StoreSheetProps) {
  const { selectedStore, setIsInFullscreen } = useContext(SearchContext);
  const [snap, setSnap] = useState<number | string | null>("355px");

  useEffect(() => {
    if (selectedStore != null) {
      setSnap("355px");
    }
  }, [selectedStore]);

  useEffect(() => {
    if (setIsInFullscreen) {
      setIsInFullscreen(snap === 1);
    }
  }, [snap, setIsInFullscreen]);

  return (
    <Drawer.Root
      open={selectedStore != null}
      dismissible={false}
      snapPoints={["148px", "355px", 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      shouldScaleBackground={true}
      modal={false}
    >
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Portal>
        <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[98%] mt-24 fixed bottom-0 left-0 right-0 md:hidden">
          <Drawer.Title className="sr-only">
            Store details and games
          </Drawer.Title>
          <div className="px-4 pt-4 bg-white rounded-t-[10px]">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-4" />
          </div>

          <StorePanel onClose={onClose} canScroll={snap === 1} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
