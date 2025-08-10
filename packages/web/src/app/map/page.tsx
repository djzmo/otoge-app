import { Metadata } from "next";
import MapApp from "../MapApp";

export const metadata: Metadata = {
  title: "Map - otoge.app",
  description:
    "Discover arcade locations with your favorite rhythm games including beatmania IIDX, maimai DX, CHUNITHM, DDR, and more.",
};

export default function MapPage() {
  return <MapApp initialSearchQuery="" />;
}