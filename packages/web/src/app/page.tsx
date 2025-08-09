import { Metadata } from "next";
import MapApp from "./MapApp";

export const metadata: Metadata = {
  title: "otoge.app - Find rhythm game arcades near you",
  description:
    "Discover arcade locations with your favorite rhythm games including beatmania IIDX, maimai DX, CHUNITHM, DDR, and more.",
};

export default function Home() {
  return <MapApp />;
}
