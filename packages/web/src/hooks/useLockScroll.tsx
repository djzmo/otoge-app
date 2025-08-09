"use client";

import { useRef, useState } from "react";
import { SwipeEventData, useSwipeable } from "react-swipeable";

export default function useLockScroll() {
  const [lockScroll, setLockScroll] = useState(false);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const lockScrollHandlers = useSwipeable({
    onSwiping: (e: SwipeEventData) => {
      setLockScroll(
        e.dir === "Down" && scrollElementRef.current?.scrollTop === 0,
      );
    },
  });
  return { lockScroll, lockScrollHandlers, scrollElementRef };
}
